-- Design Agency Database Schema
-- Run this in your Supabase SQL editor

-- Portfolio table
CREATE TABLE IF NOT EXISTS portfolio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT,
  message TEXT NOT NULL,
  budget TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  featured_image TEXT,
  meta_title TEXT,
  meta_description TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Portfolio: public read, authenticated write
CREATE POLICY "Portfolio public read" ON portfolio FOR SELECT USING (true);
CREATE POLICY "Portfolio admin write" ON portfolio FOR ALL USING (auth.role() = 'authenticated');

-- Messages: public insert, authenticated read
CREATE POLICY "Messages public insert" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Messages admin read" ON messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Messages admin update" ON messages FOR UPDATE USING (auth.role() = 'authenticated');

-- Reviews: public insert and approved select, authenticated all
CREATE POLICY "Reviews public insert" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Reviews public approved read" ON reviews FOR SELECT USING (approved = true);
CREATE POLICY "Reviews admin all" ON reviews FOR ALL USING (auth.role() = 'authenticated');

-- Blog: public read published, authenticated all
CREATE POLICY "Blog public read" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Blog admin all" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');

-- Storage bucket setup (run after enabling storage extension)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('blog', 'blog', true);

-- Storage policies
-- CREATE POLICY "Portfolio images public" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
-- CREATE POLICY "Portfolio images admin upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio' AND auth.role() = 'authenticated');
-- CREATE POLICY "Portfolio images admin delete" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');
