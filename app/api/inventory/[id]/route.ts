import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { transformDatabaseEntry, prepareForDatabase } from '@/lib/db-utils';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('Fetching inventory entry with ID:', params.id);
    
    // Ensure ID is properly formatted (UUID formatting check)
    if (!params.id || params.id.trim() === '') {
      return NextResponse.json({ error: 'Invalid ID provided' }, { status: 400 });
    }
    
    const { data: entry, error } = await supabase
      .from('inventory_entries')
      .select('*')
      .eq('id', params.id.trim())
      .single();
    
    if (error) {
      console.error('Error fetching inventory entry:', error);
      console.error('Error details:', JSON.stringify(error));
      return NextResponse.json({ error: 'Inventory entry not found' }, { status: 404 });
    }
    
    // Transform response to match expected format in frontend
    const transformedEntry = transformDatabaseEntry(entry);
    
    return NextResponse.json(transformedEntry);
  } catch (error) {
    console.error('Error fetching inventory entry:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory entry' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('Updating inventory entry with ID:', params.id);
    
    // Ensure ID is properly formatted
    if (!params.id || params.id.trim() === '') {
      return NextResponse.json({ error: 'Invalid ID provided' }, { status: 400 });
    }
    
    const data = await req.json();
    
    // Use utility function to prepare data for database
    const supabaseData = prepareForDatabase(data);
    
    console.log('Prepared data for update:', supabaseData);
    
    // Update the entry
    const { data: entry, error } = await supabase
      .from('inventory_entries')
      .update(supabaseData)
      .eq('id', params.id.trim())
      .select()
      .single();
    
    if (error) {
      console.error('Error updating inventory entry:', error);
      return NextResponse.json({ error: 'Failed to update inventory entry' }, { status: 500 });
    }
    
    // Transform response to match expected format in frontend
    const transformedEntry = transformDatabaseEntry(entry);
    
    return NextResponse.json(transformedEntry);
  } catch (error) {
    console.error('Error updating inventory entry:', error);
    return NextResponse.json({ error: 'Failed to update inventory entry' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('Deleting inventory entry with ID:', params.id);
    
    // Ensure ID is properly formatted
    if (!params.id || params.id.trim() === '') {
      return NextResponse.json({ error: 'Invalid ID provided' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('inventory_entries')
      .delete()
      .eq('id', params.id.trim());
    
    if (error) {
      console.error('Error deleting inventory entry:', error);
      console.error('Error details:', JSON.stringify(error));
      return NextResponse.json({ error: 'Failed to delete inventory entry' }, { status: 500 });
    }
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error deleting inventory entry:', error);
    return NextResponse.json({ error: 'Failed to delete inventory entry' }, { status: 500 });
  }
}
