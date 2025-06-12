import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { transformDatabaseEntry, prepareForDatabase } from '@/lib/db-utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url!);
    const limit = parseInt(searchParams.get('limit') || '0', 10);
    const lowStock = searchParams.get('lowStock');

    console.log(`[API] GET /api/inventory - limit: ${limit}, lowStock: ${lowStock}`);
    
    let query = supabase
      .from('inventory_entries')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Add filters
    if (lowStock) {
      query = query.lt('quantity', 10);
    }
    
    // Add limit
    if (limit > 0) {
      query = query.limit(limit);
    }
    
    const { data: entries, error } = await query;
    
    if (error) {
      console.error('Error fetching inventory entries:', error);
      return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
    }
    
    if (!entries || entries.length === 0) {
      console.log('No inventory entries found');
      return NextResponse.json([]);
    }
    
    // Transform entries to match frontend expectations
    const transformedEntries = entries.map(entry => transformDatabaseEntry(entry));
    
    return NextResponse.json(transformedEntries);
  } catch (err) {
    console.error('Unexpected error in GET /api/inventory:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    console.log('[API] POST /api/inventory - Creating new entry', { 
      from: data.from, 
      to: data.to,
      date: data.date 
    });
    
    // Use utility function to prepare data for database
    const supabaseData = prepareForDatabase(data);
    
    // Validate required fields before insertion
    if (!supabaseData.from_location || !supabaseData.to_location || 
        !supabaseData.material_description || !supabaseData.date) {
      const missingFields = [];
      if (!supabaseData.from_location) missingFields.push('from_location');
      if (!supabaseData.to_location) missingFields.push('to_location');
      if (!supabaseData.material_description) missingFields.push('material_description');
      if (!supabaseData.date) missingFields.push('date');
      
      console.error('Missing required fields:', missingFields);
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }
    
    if (typeof supabaseData.quantity !== 'number' || isNaN(supabaseData.quantity)) {
      console.error('Invalid quantity:', supabaseData.quantity);
      return NextResponse.json({ 
        error: `Invalid quantity: ${supabaseData.quantity}` 
      }, { status: 400 });
    }
    
    // Attempt to insert data into Supabase
    try {
      const { data: entry, error } = await supabase
        .from('inventory_entries')
        .insert(supabaseData)
        .select()
        .single();
        
      if (error) {
        console.error('Error creating inventory entry:', error);
        return NextResponse.json({ 
          error: `Failed to create entry: ${error.message}`,
          details: error
        }, { status: 500 });
      }
      
      if (!entry) {
        console.error('No entry returned after insertion');
        return NextResponse.json({ error: 'No entry returned after creation' }, { status: 500 });
      }
      
      // Transform response to match expected format in frontend
      const transformedEntry = transformDatabaseEntry(entry);
      console.log('Entry created successfully:', entry.id);
      
      return NextResponse.json(transformedEntry);
    } catch (insertError) {
      console.error('Error during Supabase insert:', insertError);
      return NextResponse.json({ 
        error: `Database insertion error: ${insertError.message || 'Unknown error'}`,
        details: insertError
      }, { status: 500 });
    }
  } catch (err) {
    console.error('Unexpected error in POST /api/inventory:', err);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}
