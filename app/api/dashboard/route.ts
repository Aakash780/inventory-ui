import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Total items (sum of all quantities)
    const { data: totalItemsData, error: totalItemsError } = await supabase
      .from('inventory_entries')
      .select('quantity')
      .eq('status', 'completed');

    // Items In (sum of quantities where status is 'completed' and quantity > 0)
    const { data: itemsInData, error: itemsInError } = await supabase
      .from('inventory_entries')
      .select('quantity')
      .eq('status', 'completed')
      .gt('quantity', 0);

    // Items Out (sum of quantities where status is 'returned' or 'pending' and quantity > 0)
    const { data: itemsOutData, error: itemsOutError } = await supabase
      .from('inventory_entries')
      .select('quantity')
      .in('status', ['returned', 'pending'])
      .gt('quantity', 0);    // Low stock alerts (count of items with quantity less than a threshold, e.g., 10)
    const { count: lowStockAlerts, error: lowStockError } = await supabase
      .from('inventory_entries')
      .select('*', { count: 'exact', head: true })
      .lt('quantity', 10);
    
    // Calculate totals
    const totalItems = totalItemsData?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;
    const itemsIn = itemsInData?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;
    const itemsOut = itemsOutData?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;
    
    return NextResponse.json({
      totalItems,
      itemsIn,
      itemsOut,
      lowStockAlerts: lowStockAlerts || 0,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
