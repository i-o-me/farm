# Project: Plant Showcase Website with Admin Dashboard

## 1. Goal
Build a modern, minimal website that showcases plants from a farm. The public site is a read-only gallery where visitors browse plants and read details about them. The site owner (admin) manages all content through a secure admin dashboard, where they can add, edit, and delete plants and upload photos and information.

The site is a showcase only: no shopping cart, no payments, no visitor accounts.

## 2. Tech Stack (use this unless I say otherwise)
- Framework: Next.js (App Router) with TypeScript
- Styling: Tailwind CSS (optionally shadcn/ui components)
- Backend/Database/Auth/Storage: Supabase (Postgres, Auth, Storage bucket for images)
- Deployment target: Vercel
- Use environment variables for all secrets and provide a .env.example

## 3. Public Website

### Pages
1. Home (/)
   - Hero section: short tagline, farm name, subtle background image, and a "Explore Plants" button
   - Featured plants section (plants the admin marks as "featured")
   - Short "About the Farm" section (editable by admin)
   - Footer with contact info and optional social links
2. Plants Gallery (/plants)
   - Responsive grid of plant cards (photo, name, category, short description)
   - Search by name
   - Filter by category (e.g. Vegetable, Fruit, Herb, Flower, Tree, Other)
   - Only "published" plants are visible to the public
   - Pagination or "load more"
3. Plant Detail (/plants/[slug])
   - Image gallery/carousel with multiple photos
   - Common name and scientific name
   - Category, growing season, growth duration, sunlight, watering needs, soil type
   - Full description and care or growing tips
   - Optional "Related plants" from the same category
   - SEO-friendly URL (slug) and metadata (title, description, Open Graph image)
4. 404 page and empty states (e.g. "No plants found")

### Public UX requirements
- Fully responsive (mobile first)
- Fast loading: optimized images (next/image), lazy loading, skeleton loaders
- Accessible: alt text on images, keyboard navigation, good color contrast

## 4. Admin Dashboard (/admin)

### Authentication
- Login page (/admin/login) using Supabase Auth (email + password)
- All /admin routes are protected by middleware; unauthenticated users are redirected to login
- Only authorized admin accounts can access the dashboard (enforce with Row Level Security and a role check, not just hiding UI)
- Logout button

### Dashboard features
1. Overview: total plants, published vs. draft count, recently added plants
2. Plants management (/admin/plants)
   - Table/list view with thumbnail, name, category, status, and actions (edit, delete, toggle publish, toggle featured)
   - Search and filter
   - Delete confirmation dialog
3. Add/Edit Plant form (/admin/plants/new and /admin/plants/[id])
   - Fields:
     - Common name (required)
     - Scientific name
     - Slug (auto-generated from name, editable)
     - Category (select, admin can manage categories)
     - Short description (max ~160 chars, shown on cards)
     - Full description (rich text or markdown editor)
     - Growing season, growth duration, sunlight, watering, soil type
     - Care/growing tips
     - Status: Draft or Published
     - Featured: yes or no
   - Image upload:
     - Multiple images per plant, drag and drop
     - Image preview, reorder, delete, and choose a cover image
     - Validate file type (jpg, png, webp) and size (max 5 MB each)
     - Upload to Supabase Storage and store the URLs in the database
   - Form validation (Zod + React Hook Form) with clear error messages
   - Success/error toast notifications
4. Categories management (/admin/categories): add, rename, delete categories
5. Site settings (/admin/settings): farm name, tagline, about text, hero image, contact email/phone/address, social links (these feed the public pages)

## 5. Data Model (Supabase / Postgres)
- plants: id, name, scientific_name, slug (unique), category_id, short_description, description, growing_season, growth_duration, sunlight, watering, soil_type, care_tips, status (draft|published), is_featured, created_at, updated_at
- plant_images: id, plant_id (FK, cascade delete), url, storage_path, alt_text, sort_order, is_cover
- categories: id, name, slug
- site_settings: single-row table with the settings fields above
- Row Level Security:
  - Public can SELECT only published plants and their images, categories, and settings
  - Only authenticated admins can INSERT, UPDATE, DELETE
- Storage bucket "plant-images": public read, admin-only write

Include SQL migration files and seed data with 6-8 sample plants so the site looks alive on first run.

## 6. UI / Design Direction: Modern & Minimal
- Clean layout, generous white space, plenty of breathing room
- Color palette: off-white background (#FAFAF7), deep forest green as the primary accent (#2F5D3A), soft sage for secondary surfaces, near-black text. Keep it to 1 accent color.
- Typography: a modern sans-serif (Inter or Geist) for the body; optionally one elegant serif (e.g. Fraunces or Playfair Display) for large headings
- Large, high-quality photography as the hero of every card; consistent aspect ratio (4:5 or 1:1), rounded corners (12-16px), subtle shadows
- Subtle micro-interactions only: hover zoom on images, smooth fades, soft transitions (150-250ms). No heavy animations.
- Support dark mode (optional but nice to have)
- Admin dashboard: same design language, with a simple sidebar layout, clean tables, and clear primary buttons

## 7. Non-functional Requirements
- SEO: sitemap.xml, robots.txt, meta tags, Open Graph tags, semantic HTML
- Performance: Lighthouse score 90+ on the public pages
- Security: validate all inputs on the server, sanitize rich text/markdown, never expose the Supabase service role key to the client
- Clean, well-organized code structure (components/, lib/, app/, types/), reusable components, meaningful naming, comments only where useful

## 8. Deliverables
1. Complete working source code
2. README with: setup steps, how to create the Supabase project, how to run migrations and seed data, how to create the first admin user, environment variables, and deployment instructions
3. .env.example
4. SQL migrations + seed script

## 9. How to Work
- First, briefly outline your plan and folder structure, then build step by step: setup, database, public pages, auth, admin dashboard, polish
- Make sensible assumptions instead of asking many questions, and list your assumptions at the end
- After building, self-check against the acceptance criteria below

## 10. Acceptance Criteria
- [ ] A visitor can browse, search, filter, and open plant detail pages without logging in
- [ ] Draft plants never appear on the public site
- [ ] Admin can log in, add a plant with multiple photos, edit it, publish it, and delete it
- [ ] Newly published plants appear on the public site immediately
- [ ] Non-admin users cannot access /admin or write to the database (verified via RLS)
- [ ] The site looks clean and consistent on mobile, tablet, and desktop
- [ ] The project runs locally with the README instructions only