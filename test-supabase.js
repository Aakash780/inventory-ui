// Script to test the Supabase connection
import { supabase } from './lib/supabase';

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Simple query to see if connection works
    const { data, error } = await supabase
      .from('inventory_entries')
      .select('count(*)', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error connecting to Supabase:', error.message);
      return false;
    }
    
    console.log('Successfully connected to Supabase!');
    console.log(`Your database has a table named 'inventory_entries'`);
    console.log(`Table has ${data} records`);
    return true;
  } catch (err) {
    console.error('Error testing connection:', err);
    return false;
  }
}

testSupabaseConnection().then((success) => {
  if (!success) {
    console.error('\nConnection failed. Please check:');
    console.error('1. Your .env.local file has correct NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.error('2. The Supabase project is running and accessible');
    console.error('3. You have created the inventory_entries table in your Supabase database');
    console.error('\nCheck the documentation for more help: https://supabase.io/docs/guides/getting-started');
  } else {
    console.log('\nYour Supabase connection is configured correctly!');
  }
  process.exit(0);
});
