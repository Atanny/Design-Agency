# Lumis Studio — Design Agency Website

A full-stack Next.js 14 design agency website with Supabase backend, admin dashboard, and Apple-inspired UI.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + React + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Notifications**: React Hot Toast

## Features

### Public Website
- 🏠 **Home Page** — Hero, Services grid, Portfolio preview, Testimonials, CTA, Contact form
- 🎨 **Services Page** — Detailed service info with Apple-style alternating layout and pricing tiers
- 🖼 **Portfolio Page** — Masonry grid with category filtering, image preview modal, lazy loading
- ⭐ **Reviews Page** — Client testimonials + review submission form
- 📝 **Blog** — SEO-optimized blog with slug-based URLs
- 📧 **Contact Page** — Full project inquiry form

### Admin Dashboard
- 🔒 **Auth** — Supabase email/password authentication
- 📊 **Overview** — Stats: portfolio items, reviews, messages, blog posts
- 🖼 **Portfolio Manager** — Upload images to Supabase Storage, add/delete items
- 💬 **Message Manager** — View, filter, and resolve project inquiries
- ⭐ **Review Manager** — Approve/reject/delete client reviews
- 📝 **Blog Manager** — Create, edit, publish, and delete blog posts

### SEO
- Dynamic meta tags per page
- Open Graph + Twitter Card tags
- XML Sitemap
- Robots.txt
- Schema markup ready

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `lib/schema.sql`
3. Go to **Storage** → Create buckets:
   - `portfolio` (Public bucket)
   - `blog` (Public bucket)
4. Copy storage policy SQL from `lib/schema.sql` and uncomment it, then run

### 3. Configure Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in your values:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxx
```

### 4. Create Admin User

In Supabase Dashboard → Authentication → Users → Add User:
- Email: your admin email
- Password: your password

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

### 6. Production Build

```bash
npm run build
npm start
```

## Project Structure

```
/app
  /admin              — Admin dashboard (auth protected)
    /login            — Login page
    /portfolio        — Portfolio manager
    /messages         — Message manager
    /reviews          — Review manager
    /blog             — Blog manager
  /services           — Services page
  /portfolio          — Public portfolio
  /reviews            — Reviews + submission
  /contact            — Contact form
  /blog               — Blog listing
    /[slug]           — Individual blog post
  layout.tsx          — Root layout
  page.tsx            — Home page
  sitemap.ts          — Dynamic sitemap
  robots.ts           — SEO robots

/components
  Navbar.tsx          — Sticky navigation with dark mode
  Footer.tsx          — Site footer
  Hero.tsx            — Animated hero section
  ServicesSection.tsx — Apple-style service cards
  PortfolioGrid.tsx   — Grid with filters + modal
  ReviewCard.tsx      — Client review card
  ContactForm.tsx     — Project inquiry form
  ThemeProvider.tsx   — Dark/light mode context

/lib
  supabaseClient.ts   — Supabase client
  schema.sql          — Database schema + RLS policies

/types
  index.ts            — TypeScript interfaces
```

## Customization

### Branding
- Replace "Lumis Studio" with your agency name throughout
- Update colors in `tailwind.config.ts` (gold accent color)
- Update `app/layout.tsx` metadata with your domain + descriptions

### Adding Services
Edit `components/ServicesSection.tsx` and `app/services/page.tsx`

### Fonts
Change fonts in `app/layout.tsx` — currently uses Playfair Display + DM Sans

## Deployment

Deploy to Vercel:

```bash
npx vercel
```

Add environment variables in Vercel dashboard.

Update `baseUrl` in `app/sitemap.ts` and `app/robots.ts` with your domain.
