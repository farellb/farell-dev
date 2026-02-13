-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variant ENABLE ROW LEVEL SECURITY; -- Typo in previous seed.ts? Check table name. seed.ts uses 'product_variants'
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY; 
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Allow Anon (Public) access for everything (Development Only)
-- This allows anyone with the Anon Key to Create/Read/Update/Delete
CREATE POLICY "Public Access Products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Variants" ON product_variants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Images" ON product_images FOR ALL USING (true) WITH CHECK (true);

-- Ensure description column exists in products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS description text;
-- Ensure type column exists (used in seed.ts)
ALTER TABLE products ADD COLUMN IF NOT EXISTS type text;
-- Ensure is_active column exists
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
