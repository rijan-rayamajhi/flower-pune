-- ============================================================================
-- FLOWER PUNE — Production-Ready Supabase PostgreSQL Schema
-- ============================================================================
-- Run this file in the Supabase SQL Editor (or via migrations).
-- Prerequisites: Supabase project with Auth enabled.
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 0. EXTENSIONS
-- ────────────────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ────────────────────────────────────────────────────────────────────────────
-- 1. ENUMS
-- ────────────────────────────────────────────────────────────────────────────
CREATE TYPE order_status AS ENUM (
  'placed',
  'confirmed',
  'preparing',
  'dispatched',
  'delivered',
  'cancelled'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'paid',
  'failed',
  'refunded'
);

CREATE TYPE payment_method AS ENUM (
  'credit_card',
  'debit_card',
  'upi',
  'net_banking',
  'cod',
  'wallet'
);

CREATE TYPE address_type AS ENUM (
  'home',
  'office',
  'other'
);

CREATE TYPE user_role AS ENUM (
  'customer',
  'admin'
);

CREATE TYPE bouquet_status AS ENUM (
  'draft',
  'added_to_cart',
  'ordered'
);

-- ────────────────────────────────────────────────────────────────────────────
-- 2. TABLES
-- ────────────────────────────────────────────────────────────────────────────

-- ── PROFILES (extends auth.users) ──────────────────────────────────────────
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  phone         TEXT,
  avatar_url    TEXT,
  role          user_role NOT NULL DEFAULT 'customer',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'Public profile data extending auth.users.';

-- ── CATEGORIES ─────────────────────────────────────────────────────────────
CREATE TABLE categories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  image_url     TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE categories IS 'Product categories (Bouquets, Plants, Signature Boxes, etc.).';

-- ── PRODUCTS ───────────────────────────────────────────────────────────────
CREATE TABLE products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  short_description TEXT,
  price         NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10, 2) CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
  sku           TEXT UNIQUE,
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured   BOOLEAN NOT NULL DEFAULT FALSE,
  meta_title    TEXT,
  meta_description TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE products IS 'Main product catalogue.';

-- ── PRODUCT IMAGES ─────────────────────────────────────────────────────────
CREATE TABLE product_images (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url     TEXT NOT NULL,
  alt_text      TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_primary    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE product_images IS 'Gallery images for each product.';

-- ── OCCASIONS ──────────────────────────────────────────────────────────────
CREATE TABLE occasions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  subtitle      TEXT,
  hero_image    TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE occasions IS 'Occasion types (Birthday, Anniversary, Wedding, etc.).';

-- ── PRODUCT ↔ OCCASIONS (many-to-many) ─────────────────────────────────────
CREATE TABLE product_occasions (
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  occasion_id   UUID NOT NULL REFERENCES occasions(id) ON DELETE CASCADE,
  PRIMARY KEY   (product_id, occasion_id)
);

COMMENT ON TABLE product_occasions IS 'Junction table linking products to occasions.';

-- ── FLOWERS (for custom bouquet builder) ───────────────────────────────────
CREATE TABLE flowers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  price         NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url     TEXT,
  color_class   TEXT NOT NULL DEFAULT 'bg-gray-200',
  display_order INT NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE flowers IS 'Individual flower types available in the custom bouquet builder.';

-- ── ADDRESSES ──────────────────────────────────────────────────────────────
CREATE TABLE addresses (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label         TEXT,
  address_type  address_type NOT NULL DEFAULT 'home',
  full_name     TEXT NOT NULL,
  phone         TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city          TEXT NOT NULL,
  state         TEXT NOT NULL,
  pincode       TEXT NOT NULL,
  is_default    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE addresses IS 'Saved delivery addresses for customers.';

-- ── ORDERS ─────────────────────────────────────────────────────────────────
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number    TEXT NOT NULL UNIQUE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  address_id      UUID REFERENCES addresses(id) ON DELETE SET NULL,

  -- Snapshot of delivery address at time of order (in case address is later changed/deleted)
  shipping_full_name  TEXT NOT NULL,
  shipping_phone      TEXT NOT NULL,
  shipping_address    TEXT NOT NULL,
  shipping_city       TEXT NOT NULL,
  shipping_state      TEXT NOT NULL,
  shipping_pincode    TEXT NOT NULL,

  status          order_status NOT NULL DEFAULT 'placed',
  payment_status  payment_status NOT NULL DEFAULT 'pending',
  payment_method  payment_method,
  upi_transaction_id TEXT,

  subtotal        NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  shipping_fee    NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
  discount        NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total           NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total >= 0),

  notes           TEXT,
  delivery_date   DATE,
  delivery_slot   TEXT,

  placed_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at    TIMESTAMPTZ,
  dispatched_at   TIMESTAMPTZ,
  delivered_at    TIMESTAMPTZ,
  cancelled_at    TIMESTAMPTZ,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE orders IS 'Customer orders with full lifecycle tracking.';

-- ── ORDER ITEMS ────────────────────────────────────────────────────────────
CREATE TABLE order_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id    UUID REFERENCES products(id) ON DELETE SET NULL,

  -- Snapshot fields (so order history survives product edits/deletes)
  product_name  TEXT NOT NULL,
  product_image TEXT,
  unit_price    NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  quantity      INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  line_total    NUMERIC(10, 2) GENERATED ALWAYS AS (unit_price * quantity) STORED,

  -- For custom bouquet orders
  custom_bouquet_id UUID,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE order_items IS 'Individual line items within an order.';

-- ── CUSTOM BOUQUETS ────────────────────────────────────────────────────────
CREATE TABLE custom_bouquets (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL DEFAULT 'My Custom Bouquet',
  status        bouquet_status NOT NULL DEFAULT 'draft',
  total_price   NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total_price >= 0),
  delivery_date DATE,
  delivery_slot TEXT,
  pincode       TEXT,
  message       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE custom_bouquets IS 'User-designed custom bouquet configurations.';

-- ── CUSTOM BOUQUET ITEMS ───────────────────────────────────────────────────
CREATE TABLE custom_bouquet_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bouquet_id      UUID NOT NULL REFERENCES custom_bouquets(id) ON DELETE CASCADE,
  flower_name     TEXT NOT NULL,
  flower_image    TEXT,
  unit_price      NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  quantity        INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  line_total      NUMERIC(10, 2) GENERATED ALWAYS AS (unit_price * quantity) STORED,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE custom_bouquet_items IS 'Individual flower selections within a custom bouquet.';

-- ── Add FK from order_items back to custom_bouquets ────────────────────────
ALTER TABLE order_items
  ADD CONSTRAINT fk_order_items_custom_bouquet
  FOREIGN KEY (custom_bouquet_id) REFERENCES custom_bouquets(id) ON DELETE SET NULL;

-- ── WISHLISTS ──────────────────────────────────────────────────────────────
CREATE TABLE wishlists (
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY   (user_id, product_id)
);

COMMENT ON TABLE wishlists IS 'User product wishlists (server-side persistence).';

-- ── REVIEWS ────────────────────────────────────────────────────────────────
CREATE TABLE reviews (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating        SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title         TEXT,
  body          TEXT,
  is_verified   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, user_id)  -- one review per user per product
);

COMMENT ON TABLE reviews IS 'Product reviews and ratings.';

-- ── COUPONS ────────────────────────────────────────────────────────────────
CREATE TABLE coupons (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code            TEXT NOT NULL UNIQUE,
  description     TEXT,
  discount_type   TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value  NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
  min_order_value NUMERIC(10, 2) DEFAULT 0,
  max_uses        INT,
  used_count      INT NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  valid_from      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE coupons IS 'Discount coupons and promo codes.';

-- ── NEWSLETTER SUBSCRIBERS ─────────────────────────────────────────────────
CREATE TABLE newsletter_subscribers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT NOT NULL UNIQUE,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

COMMENT ON TABLE newsletter_subscribers IS 'Email newsletter signup list.';

-- ── CONTACT MESSAGES ───────────────────────────────────────────────────────
CREATE TABLE contact_messages (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  subject       TEXT,
  message       TEXT NOT NULL,
  is_read       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE contact_messages IS 'Messages submitted via the contact form.';

-- ── ADMIN EMAILS ───────────────────────────────────────────────────────────
CREATE TABLE admin_emails (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE admin_emails IS 'Emails that automatically receive the admin role on signup.';

-- ── SITE SETTINGS (key-value store) ───────────────────────────────────────
CREATE TABLE site_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL DEFAULT '',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE site_settings IS 'Key-value store for admin-configurable site settings (e.g. upi_id).';

-- Seed a default UPI ID row
INSERT INTO site_settings (key, value) VALUES ('upi_id', '') ON CONFLICT (key) DO NOTHING;

-- ── NOTIFICATIONS ──────────────────────────────────────────────────────────
CREATE TABLE notifications (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type          TEXT NOT NULL CHECK (type IN ('order', 'message', 'alert')),
  title         TEXT NOT NULL,
  message       TEXT NOT NULL,
  link          TEXT,
  is_read       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE notifications IS 'System notifications for admins.';

-- ────────────────────────────────────────────────────────────────────────────
-- 3. INDEXES FOR PERFORMANCE
-- ────────────────────────────────────────────────────────────────────────────

-- Products
CREATE INDEX idx_products_category    ON products(category_id);
CREATE INDEX idx_products_slug        ON products(slug);
CREATE INDEX idx_products_active      ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_products_featured    ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_price       ON products(price);
CREATE INDEX idx_products_created     ON products(created_at DESC);

-- Product images
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_primary ON product_images(product_id) WHERE is_primary = TRUE;

-- Categories
CREATE INDEX idx_categories_slug      ON categories(slug);
CREATE INDEX idx_categories_active    ON categories(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_categories_order     ON categories(display_order);

-- Occasions
CREATE INDEX idx_occasions_slug       ON occasions(slug);
CREATE INDEX idx_occasions_active     ON occasions(is_active) WHERE is_active = TRUE;

-- Product occasions
CREATE INDEX idx_product_occasions_occasion ON product_occasions(occasion_id);

-- Flowers
CREATE INDEX idx_flowers_slug       ON flowers(slug);
CREATE INDEX idx_flowers_active     ON flowers(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_flowers_order      ON flowers(display_order);

-- Addresses
CREATE INDEX idx_addresses_user       ON addresses(user_id);

-- Orders
CREATE INDEX idx_orders_user          ON orders(user_id);
CREATE INDEX idx_orders_status        ON orders(status);
CREATE INDEX idx_orders_payment       ON orders(payment_status);
CREATE INDEX idx_orders_number        ON orders(order_number);
CREATE INDEX idx_orders_created       ON orders(created_at DESC);
CREATE INDEX idx_orders_delivery_date ON orders(delivery_date);

-- Order items
CREATE INDEX idx_order_items_order    ON order_items(order_id);
CREATE INDEX idx_order_items_product  ON order_items(product_id);

-- Custom bouquets
CREATE INDEX idx_custom_bouquets_user ON custom_bouquets(user_id);

-- Custom bouquet items
CREATE INDEX idx_bouquet_items_bouquet ON custom_bouquet_items(bouquet_id);

-- Wishlists
CREATE INDEX idx_wishlists_user       ON wishlists(user_id);
CREATE INDEX idx_wishlists_product    ON wishlists(product_id);

-- Reviews
CREATE INDEX idx_reviews_product      ON reviews(product_id);
CREATE INDEX idx_reviews_user         ON reviews(user_id);
CREATE INDEX idx_reviews_rating       ON reviews(product_id, rating);

-- Coupons
CREATE INDEX idx_coupons_code         ON coupons(code);
CREATE INDEX idx_coupons_active       ON coupons(is_active) WHERE is_active = TRUE;

-- Newsletter
CREATE INDEX idx_newsletter_email     ON newsletter_subscribers(email);

-- Contact messages
CREATE INDEX idx_contact_read         ON contact_messages(is_read) WHERE is_read = FALSE;
CREATE INDEX idx_contact_created      ON contact_messages(created_at DESC);

-- Admin emails
CREATE INDEX idx_admin_emails_email   ON admin_emails(email);

-- Notifications
CREATE INDEX idx_notifications_read   ON notifications(is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ────────────────────────────────────────────────────────────────────────────
-- 4. FUNCTIONS & TRIGGERS
-- ────────────────────────────────────────────────────────────────────────────

-- Auto-update `updated_at` on row modification
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables with that column
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_occasions_updated_at
  BEFORE UPDATE ON occasions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_flowers_updated_at
  BEFORE UPDATE ON flowers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_custom_bouquets_updated_at
  BEFORE UPDATE ON custom_bouquets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Ensure admin emails are always stored lowercase
CREATE OR REPLACE FUNCTION normalize_admin_email()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email := LOWER(TRIM(NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_normalize_admin_email
  BEFORE INSERT OR UPDATE ON admin_emails
  FOR EACH ROW EXECUTE FUNCTION normalize_admin_email();

-- Auto-create profile on user signup (with admin role check)
-- NOTE: SET search_path = public is required because this trigger runs under
-- supabase_auth_admin which doesn't have 'public' in its default search_path.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  _role public.user_role;
BEGIN
  -- Check if the new user's email exists in admin_emails
  IF EXISTS (SELECT 1 FROM public.admin_emails WHERE email = LOWER(NEW.email)) THEN
    _role := 'admin';
  ELSE
    _role := 'customer';
  END IF;

  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.raw_user_meta_data ->> 'phone',
    _role
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Generate sequential order number: FLR-2026-XXXXX
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  year_part TEXT;
  seq_part  TEXT;
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');
  seq_part  := LPAD(NEXTVAL('order_number_seq')::TEXT, 5, '0');
  NEW.order_number := 'FLR-' || year_part || '-' || seq_part;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1;

CREATE TRIGGER trg_generate_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_order_number();

-- ────────────────────────────────────────────────────────────────────────────
-- 5. ROW LEVEL SECURITY (RLS)
-- ────────────────────────────────────────────────────────────────────────────

-- Enable RLS on ALL tables
ALTER TABLE profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories            ENABLE ROW LEVEL SECURITY;
ALTER TABLE products              ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images        ENABLE ROW LEVEL SECURITY;
ALTER TABLE occasions             ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_occasions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses             ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders                ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items           ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_bouquets       ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_bouquet_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists             ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews               ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons               ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_emails          ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications         ENABLE ROW LEVEL SECURITY;
ALTER TABLE flowers               ENABLE ROW LEVEL SECURITY;

-- ── Helper: check if user is admin ──
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── RPC: create_order_with_items ──
-- Atomically creates an order + order items in a single transaction.
-- Validates product prices & stock server-side, decrements stock_quantity.
CREATE OR REPLACE FUNCTION create_order_with_items(
  p_user_id          UUID,
  p_shipping         JSONB,
  p_delivery_date    DATE,
  p_delivery_slot    TEXT,
  p_payment_method   payment_method,
  p_items            JSONB,
  p_notes            TEXT DEFAULT NULL,
  p_upi_transaction_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id      UUID;
  v_order_number  TEXT;
  v_subtotal      NUMERIC(10,2) := 0;
  v_shipping_fee  NUMERIC(10,2) := 0;
  v_total         NUMERIC(10,2);
  v_item          JSONB;
  v_product       RECORD;
  v_qty           INT;
  v_line_count    INT := 0;
BEGIN
  v_order_number := 'FLR-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  IF EXISTS (SELECT 1 FROM orders WHERE order_number = v_order_number) THEN
    v_order_number := 'FLR-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END IF;

  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Cart is empty';
  END IF;

  -- First pass: validate all products and check stock
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_qty := (v_item->>'quantity')::INT;

    SELECT id, name, price, slug, stock_quantity
      INTO v_product
      FROM products
     WHERE id = (v_item->>'product_id')::UUID
       AND is_active = TRUE;

    IF v_product.id IS NULL THEN
      RAISE EXCEPTION 'Product not found or inactive: %', v_item->>'product_id';
    END IF;

    -- Check stock availability
    IF v_product.stock_quantity < v_qty THEN
      RAISE EXCEPTION 'Insufficient stock for "%": requested %, available %',
        v_product.name, v_qty, v_product.stock_quantity;
    END IF;

    v_subtotal := v_subtotal + (v_product.price * v_qty);
    v_line_count := v_line_count + 1;
  END LOOP;

  v_total := v_subtotal + v_shipping_fee;

  -- Decrement stock for all items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_qty := (v_item->>'quantity')::INT;
    UPDATE products
       SET stock_quantity = stock_quantity - v_qty,
           updated_at = NOW()
     WHERE id = (v_item->>'product_id')::UUID;
  END LOOP;

  INSERT INTO orders (
    order_number, user_id,
    shipping_full_name, shipping_phone, shipping_address,
    shipping_city, shipping_state, shipping_pincode,
    status, payment_status, payment_method, upi_transaction_id,
    subtotal, shipping_fee, discount, total,
    notes, delivery_date, delivery_slot
  ) VALUES (
    v_order_number, p_user_id,
    p_shipping->>'full_name', p_shipping->>'phone', p_shipping->>'address',
    p_shipping->>'city', p_shipping->>'state', p_shipping->>'pincode',
    'placed', 'pending', p_payment_method, p_upi_transaction_id,
    v_subtotal, v_shipping_fee, 0, v_total,
    p_notes, p_delivery_date, p_delivery_slot
  )
  RETURNING id INTO v_order_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_qty := (v_item->>'quantity')::INT;

    SELECT id, name, price,
           (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = products.id AND pi.is_primary = TRUE LIMIT 1) as primary_image
      INTO v_product
      FROM products
     WHERE id = (v_item->>'product_id')::UUID;

    INSERT INTO order_items (order_id, product_id, product_name, product_image, unit_price, quantity)
    VALUES (
      v_order_id,
      v_product.id,
      v_product.name,
      v_product.primary_image,
      v_product.price,
      v_qty
    );
  END LOOP;

  RETURN jsonb_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number,
    'total', v_total,
    'items_count', v_line_count
  );
END;
$$;

GRANT EXECUTE ON FUNCTION create_order_with_items TO authenticated;

-- ── RPC: cancel_order_restore_stock ──
-- Cancels an order and restores stock_quantity for each item.
-- Only works on non-cancelled, non-delivered orders.
CREATE OR REPLACE FUNCTION cancel_order_restore_stock(
  p_order_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order   RECORD;
  v_item    RECORD;
BEGIN
  -- Get the order
  SELECT id, status INTO v_order
    FROM orders
   WHERE id = p_order_id;

  IF v_order.id IS NULL THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  IF v_order.status = 'cancelled' THEN
    RAISE EXCEPTION 'Order is already cancelled';
  END IF;

  IF v_order.status = 'delivered' THEN
    RAISE EXCEPTION 'Cannot cancel a delivered order';
  END IF;

  -- Restore stock for each item
  FOR v_item IN
    SELECT product_id, quantity FROM order_items WHERE order_id = p_order_id
  LOOP
    UPDATE products
       SET stock_quantity = stock_quantity + v_item.quantity,
           updated_at = NOW()
     WHERE id = v_item.product_id;
  END LOOP;

  -- Update order status
  UPDATE orders
     SET status = 'cancelled',
         cancelled_at = NOW(),
         updated_at = NOW()
   WHERE id = p_order_id;

  RETURN jsonb_build_object('success', true, 'order_id', p_order_id);
END;
$$;

GRANT EXECUTE ON FUNCTION cancel_order_restore_stock TO authenticated;

-- ── RPC: track_order_secure ──
-- Securely retrieves limited order details for public tracking.
-- Requires EXACT match on order_number AND shipping_phone.
CREATE OR REPLACE FUNCTION track_order_secure(
  p_order_number TEXT,
  p_phone TEXT
)
RETURNS TABLE (
  order_number TEXT,
  status order_status,
  shipping_full_name TEXT,
  shipping_address TEXT,
  shipping_city TEXT,
  delivery_date DATE,
  delivery_slot TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM pg_sleep(0.5);

  RETURN QUERY
  SELECT
    o.order_number,
    o.status,
    o.shipping_full_name,
    o.shipping_address,
    o.shipping_city,
    o.delivery_date,
    o.delivery_slot
  FROM orders o
  WHERE o.order_number = p_order_number
    AND o.shipping_phone = p_phone;
END;
$$;

GRANT EXECUTE ON FUNCTION track_order_secure TO anon;
GRANT EXECUTE ON FUNCTION track_order_secure TO authenticated;

-- ────────────────────────────────────────────────────────────────────────────
-- 5a. PROFILES policies
-- ────────────────────────────────────────────────────────────────────────────
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- 5b. CATEGORIES policies (public read, admin write)
-- ────────────────────────────────────────────────────────────────────────────
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins can view all categories"
  ON categories FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- 5c. PRODUCTS policies (public read, admin write)
-- ────────────────────────────────────────────────────────────────────────────
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins can view all products"
  ON products FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- 5d. PRODUCT IMAGES policies
-- ────────────────────────────────────────────────────────────────────────────
CREATE POLICY "Anyone can view product images"
  ON product_images FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage product images"
  ON product_images FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- 5e. OCCASIONS policies
-- ────────────────────────────────────────────────────────────────────────────
CREATE POLICY "Anyone can view active occasions"
  ON occasions FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins can view all occasions"
  ON occasions FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can manage occasions"
  ON occasions FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- 5f. PRODUCT_OCCASIONS policies
-- ────────────────────────────────────────────────────────────────────────────
CREATE POLICY "Anyone can view product-occasion links"
  ON product_occasions FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage product-occasion links"
  ON product_occasions FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- 5g. ADDRESSES policies
-- ────────────────────────────────────────────────────────────────────────────
CREATE POLICY "Users can view their own addresses"
  ON addresses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own addresses"
  ON addresses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all addresses"
  ON addresses FOR SELECT
  USING (is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- 5h. ORDERS policies
-- ────────────────────────────────────────────────────────────────────────────
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update all orders"
  ON orders FOR UPDATE
  USING (is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- 5i. ORDER ITEMS policies
-- ────────────────────────────────────────────────────────────────────────────
CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own order items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  USING (is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- 5j. CUSTOM BOUQUETS policies
-- ────────────────────────────────────────────────────────────────────────────
CREATE POLICY "Users can view their own bouquets"
  ON custom_bouquets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own bouquets"
  ON custom_bouquets FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all bouquets"
  ON custom_bouquets FOR SELECT
  USING (is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- 5k. CUSTOM BOUQUET ITEMS policies
-- ────────────────────────────────────────────────────────────────────────────
CREATE POLICY "Users can view their own bouquet items"
  ON custom_bouquet_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM custom_bouquets WHERE custom_bouquets.id = custom_bouquet_items.bouquet_id AND custom_bouquets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own bouquet items"
  ON custom_bouquet_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM custom_bouquets WHERE custom_bouquets.id = custom_bouquet_items.bouquet_id AND custom_bouquets.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM custom_bouquets WHERE custom_bouquets.id = custom_bouquet_items.bouquet_id AND custom_bouquets.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all bouquet items"
  ON custom_bouquet_items FOR SELECT
  USING (is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- 5l. WISHLISTS policies
-- ────────────────────────────────────────────────────────────────────────────
CREATE POLICY "Users can view their own wishlist"
  ON wishlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wishlist"
  ON wishlists FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────────────────────
-- 5m. REVIEWS policies
-- ────────────────────────────────────────────────────────────────────────────
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (TRUE);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews"
  ON reviews FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- 5n. COUPONS policies
-- ────────────────────────────────────────────────────────────────────────────
CREATE POLICY "Authenticated users can view active coupons"
  ON coupons FOR SELECT
  USING (is_active = TRUE AND (valid_until IS NULL OR valid_until > NOW()));

CREATE POLICY "Admins can manage coupons"
  ON coupons FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- 5o. NEWSLETTER policies
-- ────────────────────────────────────────────────────────────────────────────
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Admins can view all subscribers"
  ON newsletter_subscribers FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can manage subscribers"
  ON newsletter_subscribers FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- 5p. CONTACT MESSAGES policies
-- ────────────────────────────────────────────────────────────────────────────
CREATE POLICY "Anyone can submit a contact message"
  ON contact_messages FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Admins can view all contact messages"
  ON contact_messages FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update contact messages"
  ON contact_messages FOR UPDATE
  USING (is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- 5q. ADMIN EMAILS policies
-- ────────────────────────────────────────────────────────────────────────────
CREATE POLICY "Admins can view admin emails"
  ON admin_emails FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can manage admin emails"
  ON admin_emails FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Note: Service role bypasses RLS, so the admin sync utility can insert without policies.

-- ────────────────────────────────────────────────────────────────────────────
-- 5r. FLOWERS policies (public read, admin write)
-- ────────────────────────────────────────────────────────────────────────────
CREATE POLICY "Anyone can view active flowers"
  ON flowers FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins can view all flowers"
  ON flowers FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can manage flowers"
  ON flowers FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- 5s. SITE SETTINGS policies (public read, admin write)
-- ────────────────────────────────────────────────────────────────────────────
CREATE POLICY "Anyone can read site settings"
  ON site_settings FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage site settings"
  ON site_settings FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- 5t. NOTIFICATIONS policies
-- ────────────────────────────────────────────────────────────────────────────
CREATE POLICY "Admins can view all notifications"
  ON notifications FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update notifications"
  ON notifications FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- 6. STORAGE BUCKETS (optional — run if using Supabase Storage)
-- ────────────────────────────────────────────────────────────────────────────
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
--
-- CREATE POLICY "Public can view product images"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'product-images');
--
-- CREATE POLICY "Admins can upload product images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'product-images' AND is_admin());
--
-- CREATE POLICY "Users can upload their own avatar"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ────────────────────────────────────────────────────────────────────────────
-- 7. NOTIFICATIONS TRIGGERS
-- ────────────────────────────────────────────────────────────────────────────

-- Trigger for New Orders
CREATE OR REPLACE FUNCTION notify_new_order()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (type, title, message, link)
  VALUES (
    'order',
    'New Order Received',
    'Order #' || NEW.order_number || ' has been placed by ' || NEW.shipping_full_name,
    '/admin/orders/' || NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_notify_new_order
  AFTER INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION notify_new_order();

-- Trigger for New Contact Messages
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (type, title, message, link)
  VALUES (
    'message',
    'New Contact Message',
    'New message from ' || NEW.name || ': ' || NEW.subject,
    '/admin/settings' -- Assuming messages are viewed in settings/messages or similar
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_notify_new_message
  AFTER INSERT ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION notify_new_message();

-- ────────────────────────────────────────────────────────────────────────────
-- ✅ SCHEMA COMPLETE
-- ────────────────────────────────────────────────────────────────────────────
