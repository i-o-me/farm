# Plant Showcase Website

A modern plant showcase built with Next.js App Router, Tailwind CSS, and Supabase.

## Features

- Public plant gallery with browse, search, and filter
- Plant detail pages with rich metadata and related plants
- Admin dashboard with protected routes and authentication
- Supabase-ready schema and storage flow for plant photos and settings
- Responsive design for mobile, tablet, and desktop

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

3. Fill in your Supabase values in `.env.local`.

   On Windows PowerShell, use `npm.cmd` if your execution policy blocks `npm.ps1`.

4. Run the app:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000`.

Without Supabase credentials, the site displays the bundled sample catalog. With valid credentials and the migrations applied, the public routes read published plants and site settings from Supabase.

## Supabase setup

1. Create a new Supabase project in the dashboard.
2. Run the SQL files in `supabase/migrations` in order: `001_init_schema.sql`, `002_seed_data.sql`, then `003_storage_policies.sql`.
3. The third migration creates the `plant-images` storage bucket with public read access and admin-only upload, update, and delete policies.
4. Configure the following environment variables:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

5. In Supabase Authentication, create the admin user. Then run this SQL, replacing the email:

   ```sql
   insert into public.profiles (id, is_admin)
   select id, true from auth.users
   where email = 'admin@example.com'
   on conflict (id) do update set is_admin = true;
   ```

6. Restart the dev server after changing `.env.local`:

   ```powershell
   npm.cmd run dev
   ```

## Database schema

Run the migration files in order:

```bash
psql "$DATABASE_URL" < supabase/migrations/001_init_schema.sql
psql "$DATABASE_URL" < supabase/migrations/002_seed_data.sql
psql "$DATABASE_URL" < supabase/migrations/003_storage_policies.sql
```

## First admin user

1. Sign up a user in Supabase Auth from the dashboard.
2. Update the `profiles` table or your admin role table to grant `is_admin = true`.
3. Ensure the admin row-level policy allows access to the dashboard routes.

## Deployment

1. Push to GitHub.
2. Import the repo into Vercel.
3. Add the same environment variables from `.env.example` in Vercel project settings.
4. Deploy.

## Assumptions

- This starter project uses mock data until Supabase is connected.
- The admin role is represented by a simple `is_admin` flag in the database.
- Public pages are read-only until backend data is connected.
