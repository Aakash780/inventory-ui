// Script to help with initial setup and migrations for Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// For migrations we use the service role key, which has admin privileges
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase credentials in .env.local');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY are set');
  process.exit(1);
}

// Create a supabase client with the service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const schema = fs.readFileSync(path.join(__dirname, 'supabase', 'schema.sql'), 'utf8');

async function runMigration() {
  try {
    console.log('Starting database migration...');
    
    // This assumes you have admin privileges in Supabase
    // You typically would run migrations through the Supabase dashboard SQL editor instead
    // But this can be helpful for local development or CI/CD pipelines
    const { error } = await supabase.rpc('exec_sql', { sql: schema });
    
    if (error) {
      console.error('Error running migration:', error.message);
      return false;
    }
    
    console.log('Migration completed successfully!');
    return true;
  } catch (err) {
    console.error('Error in migration process:', err);
    return false;
  }
}

// Only run the migration if explicitly called with --run flag
if (process.argv.includes('--run')) {
  runMigration().then((success) => {
    if (!success) {
      console.error('\nMigration failed. Please check the error messages above.');
      console.error('You may need to run the migration manually through the Supabase dashboard SQL editor.');
    }
    process.exit(0);
  });
} else {
  console.log('This script can be run with the --run flag to execute the migrations.');
  console.log('For safety, migrations are not automatically run.');
  console.log('\nFor most cases, we recommend running migrations through the Supabase dashboard SQL editor.');
}
