# Material Inventory UI

*A Next.js application for managing material inventory with Supabase backend*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/aakashchaurasiya780-4208s-projects/v0-material-inventory-ui)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Database: Supabase](https://img.shields.io/badge/Database-Supabase-green?style=for-the-badge&logo=supabase)](https://supabase.io/)

## Overview

This is a material inventory management system built with Next.js and Supabase. It helps track material movement, inventory levels, and provides reporting functionalities. Originally created with v0.dev, it has been enhanced with a Supabase database backend.

## Deployment

Your project is live at:

**[https://vercel.com/aakashchaurasiya780-4208s-projects/v0-material-inventory-ui](https://vercel.com/aakashchaurasiya780-4208s-projects/v0-material-inventory-ui)**

## Features

- Material inventory tracking with locations
- Status tracking (completed, pending, returned)
- Dashboard with inventory statistics
- Search and filter capabilities
- CRUD operations for inventory entries
- Responsive UI built with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (free tier works fine)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd inventory-ui
```

2. Install dependencies
```bash
yarn install
```

3. Set up Supabase
See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed instructions.

4. Configure environment variables
Copy `.env.local.example` to `.env.local` and add your Supabase credentials.

5. Run the development server
```bash
yarn dev
```

## Database Migration

This project was migrated from Prisma to Supabase. See [MIGRATION.md](MIGRATION.md) for details.

## Supabase Management

Use the built-in Supabase management tools:

```bash
# Test connection
yarn test:supabase

# Run migrations
yarn supabase:migrate

# Interactive management CLI
yarn supabase:manage
```
