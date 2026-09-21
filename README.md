# Clover & Root Farm

A plant showcase and content dashboard built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase.

The public site is read-only. Authenticated admins manage plants, categories, site settings, publication status, featured plants, and plant photos.

## Requirements

- Node.js 20 or newer
- A Supabase project
- npm

On Windows, PowerShell may block `npm.ps1`. Use the command shim in that case:

```powershell
npm.cmd install
npm.cmd run dev
```

## Run locally

From the project directory:

```powershell
cd "C:\Users\MC LARQUIL\website"
npm.cmd install
copy .env.example .env.local
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000).

After changing `.env.local`, stop and restart the development server. Next.js reads environment variables when the server starts.

## Environment variables

Set these values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXTAUTH_URL=http://localhost:3000
```

Get the first two values from Supabase **Project Settings > API**. The service role key is reserved for trusted server-side jobs and is not used by the browser dashboard. Never commit `.env.local` or expose the service role key in client code.

If Supabase credentials are missing, public pages use the bundled sample data. With valid credentials, public pages read published plants and site settings from Supabase.

## Supabase setup

### 1. Create the database

In the Supabase dashboard, open **SQL Editor** and run these files in order:

1. `supabase/migrations/001_init_schema.sql`
2. `supabase/migrations/002_seed_data.sql`
3. `supabase/migrations/003_storage_policies.sql`

The migrations create:

- `profiles` for admin authorization
- `categories`
- `plants`
- `plant_images`
- `site_settings`
- Row Level Security policies
- The public `plant-images` Storage bucket and admin-only write policies

Run each migration once on a new project. If you edit a migration after it has already run, create a new SQL migration for the change instead of blindly rerunning policies or triggers.

### 2. Create the first user

Use either the registration form at `/admin/login` or Supabase **Authentication > Users > Add user**.

Creating an Auth user does not automatically grant dashboard access. Promote the user in SQL Editor, replacing the email address:

```sql
insert into public.profiles (id, is_admin)
select id, true
from auth.users
where email = 'admin@example.com'
on conflict (id) do update set is_admin = true;
```

Confirm the role:

```sql
select u.email, p.is_admin
from auth.users u
left join public.profiles p on p.id = u.id
where u.email = 'admin@example.com';
```

The account must have `is_admin = true`. Correct credentials without this profile row will authenticate but will be redirected away from the dashboard.

### 3. Configure email authentication

The login page uses Supabase email/password authentication. In Supabase, check **Authentication > Providers > Email**.

For local development, either disable email confirmation or confirm the registration email before signing in. In production, keep email confirmation enabled and configure the project email provider.

## Admin workflow

Open:

```text
http://localhost:3000/admin/login
```

Available dashboard pages:

- `/admin` - live plant counts and recent plants
- `/admin/plants` - search, filter, publish, feature, edit, and delete plants
- `/admin/plants/new` - create a plant and upload photos
- `/admin/plants/[id]` - edit plant details and manage photos
- `/admin/categories` - add, rename, and delete categories
- `/admin/settings` - edit farm name, tagline, about text, and contact details

All `/admin/*` routes are protected by middleware. The middleware checks the Supabase session and calls the database `is_admin()` function.

## Uploading plant photos

The plant form accepts multiple:

- JPG files
- PNG files
- WebP files
- Maximum 5 MB per file

Photos are uploaded to the `plant-images` bucket under a folder for the plant. The app stores each public URL and storage path in `plant_images`. Admins can remove photos and choose the cover image used on cards and detail pages.

If uploads fail, verify that `003_storage_policies.sql` ran successfully and that the signed-in user has a matching `profiles` row with `is_admin = true`.

## Public routes

- `/` - farm homepage and featured plants
- `/plants` - searchable and filterable published plant gallery
- `/plants/[slug]` - plant detail page
- `/admin/login` - admin sign-in and registration

Draft plants are excluded from all public Supabase queries.

## Project commands

```powershell
# Install dependencies
npm.cmd install

# Start development server
npm.cmd run dev

# Check TypeScript and create a production build
npm.cmd run build

# Start the production server after building
npm.cmd run start

# Run ESLint
npm.cmd run lint
```

## Deployment to Vercel

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the Vercel project environment variables.
4. Add `SUPABASE_SERVICE_ROLE_KEY` only if a future trusted server-side job requires it.
5. Deploy.
6. Update Supabase **Authentication > URL Configuration** with the production site URL and redirect URLs.

The production Supabase project must have all three SQL migrations applied and an admin profile created.

## Troubleshooting

### `Could not find the table public.plants`

Run `001_init_schema.sql` in the Supabase SQL Editor, then run `002_seed_data.sql`.

### Correct password but redirected to login

The user is authenticated but is not authorized. Run the admin promotion SQL above and confirm `profiles.is_admin` is `true`.

### Image upload is denied

Run `003_storage_policies.sql`, confirm the `plant-images` bucket exists, and verify the current user is an admin.

### `npm.ps1 cannot be loaded`

Use `npm.cmd` instead of `npm`, or change the PowerShell policy for your current user:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### Remote image hostname error

The project already allows `images.unsplash.com` in `next.config.ts`. Restart the dev server after changing image configuration.
