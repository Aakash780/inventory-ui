# Connecting to Supabase

This guide will help you connect your application to your Supabase database. Note that we've completely removed Prisma from this project in favor of Supabase.

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Create a new project
3. Give your project a name and set a secure database password
4. Choose a region closest to your users
5. Wait for the project to be created (this may take a few minutes)

## Step 2: Set Up Your Database Schema

1. In your Supabase dashboard, go to the "SQL Editor" section
2. Create a new query
3. Copy and paste the contents of `supabase/schema.sql` into the query editor
4. Run the query to create your database tables and functions

Alternatively, you can use the migration script (requires Supabase service role key with SQL execution permissions):

```bash
# Set up your Supabase service role key in .env.local first
# SUPABASE_SERVICE_KEY=your_service_role_key

# Then run the migration
yarn supabase:migrate --run
```

## Step 3: Configure Your Application

1. In your Supabase project dashboard, go to "Settings" > "API"
2. Copy your "Project URL" and "anon" public API key
3. Open the `.env.local` file in your project
4. Update the following variables with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Step 4: Test Your Connection

1. Run the test script to verify your connection:

```bash
# With npm
npm run test:supabase

# With yarn
yarn test:supabase
```

2. If the test passes, your connection is working properly!

## Step 5: Start Your Application

```bash
# With npm
npm run dev

# With yarn
yarn dev
```

Your application should now be connected to Supabase and ready to use!

## Troubleshooting

If you encounter issues connecting to Supabase:

1. Verify your credentials are correct in `.env.local`
2. Check that you've created the required tables in Supabase
3. Ensure your IP address is not blocked by Supabase's firewall
4. Check Supabase's status page for any ongoing issues: https://status.supabase.com/
