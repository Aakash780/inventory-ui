# Migration from Prisma to Supabase

This document summarizes the changes made to migrate the project from Prisma to Supabase.

## Changes Made

1. **Removed Prisma Dependencies**
   - Removed `@prisma/client` and `prisma` from package.json
   - Deleted the Prisma client initialization file (`lib/prisma.ts`)
   - Deleted the Prisma schema directory (`prisma/`)

2. **Added Supabase Configuration**
   - Added Supabase client library (`@supabase/supabase-js`)
   - Created Supabase client initialization (`lib/supabase.ts`)
   - Added utility functions to handle data format conversions (`lib/db-utils.ts`)

3. **Updated API Routes**
   - Modified all API routes to use Supabase instead of Prisma
   - Added data transformation between frontend and database formats
   - Updated error handling for Supabase responses

4. **Created Database Schema**
   - Added SQL schema file for Supabase (`supabase/schema.sql`)
   - Created migration utility (`supabase/migrate.js`)
   - Added sample data for testing

5. **Environment Configuration**
   - Added Supabase environment variables to `.env.local`
   - Updated Next.js configuration to use environment variables

## Database Schema Differences

Prisma schema was converted to a PostgreSQL schema with the following changes:

| Prisma Field | Supabase Field | Notes |
|-------------|---------------|-------|
| `id` | `id` | Changed from CUID to UUID |
| `from` | `from_location` | Renamed due to SQL reserved keyword |
| `to` | `to_location` | Renamed for consistency |
| `quantity` | `quantity` | Changed from Int to NUMERIC(10,2) to allow decimals |
| `createdAt` | `created_at` | PostgreSQL naming convention |
| N/A | `updated_at` | Added timestamp tracking |

## Testing

To test the Supabase connection:

```bash
yarn test:supabase
```

## Next Steps

1. **Update Supabase Credentials**: 
   - Add your real Supabase URL and keys to `.env.local`

2. **Create Database Schema**:
   - Run the schema.sql in the Supabase SQL Editor
   - Or use the migration utility: `yarn supabase:migrate --run`

3. **Review & Test API Endpoints**:
   - Test all API endpoints to ensure they work correctly with Supabase
   - Check for any remaining Prisma-specific logic that might need updating

4. **Performance Optimization**:
   - Consider adding more indexes if needed
   - Review query performance for large datasets
