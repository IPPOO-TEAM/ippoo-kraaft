-- IPPOO KRAAFT ART AND HANDMADE - Schéma Supabase Complet
-- Généré automatiquement le 2026-05-16
-- Base de données PostgreSQL pour l'application e-commerce d'artisanat africain

-- =============================================================================
-- SECTION 1: USERS & AUTHENTICATION
-- =============================================================================

-- Table utilisateurs (complète auth.users de Supabase)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'artisan', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Programme de fidélité
CREATE TABLE IF NOT EXISTS public.loyalty_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Historique des transactions de fidélité
CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES public.loyalty_accounts(id) ON DELETE CASCADE,
  delta INTEGER NOT NULL, -- points gagnés (+) ou dépensés (-)
  reason TEXT NOT NULL,
  reference_id TEXT, -- ID de la commande ou action associée
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Système de parrainage
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  referred_email TEXT NOT NULL,
  referred_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  reward_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- =============================================================================
-- SECTION 2: CATALOG (PRODUCTS, ARTISANS, GROUPEMENTS)
-- =============================================================================

-- Groupements d'artisans
CREATE TABLE IF NOT EXISTS public.groupements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  specialties TEXT[], -- array de spécialités
  region TEXT NOT NULL,
  country TEXT NOT NULL,
  description TEXT,
  artisan_count INTEGER DEFAULT 0,
  product_count INTEGER DEFAULT 0,
  conformity_score INTEGER DEFAULT 0, -- score de conformité en %
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Artisans
CREATE TABLE IF NOT EXISTS public.artisans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  specialty TEXT NOT NULL,
  niches TEXT[], -- sous-catégories de spécialité
  region TEXT NOT NULL,
  country TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  groupement_id UUID REFERENCES public.groupements(id) ON DELETE SET NULL,
  products_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Catégories de produits
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  icon TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Produits
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  technique TEXT,
  niches TEXT[],
  artisan_id UUID REFERENCES public.artisans(id) ON DELETE SET NULL,
  groupement_id UUID REFERENCES public.groupements(id) ON DELETE SET NULL,

  -- Origine et traçabilité
  origin_country TEXT,
  origin_region TEXT,
  origin_village TEXT,
  story TEXT,
  ancestrality TEXT,

  -- Normes et certifications
  norms JSONB, -- [{code, name, status}]

  -- Caractéristiques physiques
  materials TEXT[],
  dimensions TEXT,
  weight TEXT,
  care_instructions TEXT,

  -- Prix et stock
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'XOF',
  stock INTEGER DEFAULT 0,
  is_unique BOOLEAN DEFAULT false,
  is_exclusive BOOLEAN DEFAULT false,

  -- Médias
  images TEXT[],

  -- Ratings et badges
  rating DECIMAL(2,1) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  badges TEXT[],

  -- Livraison
  delivery_zones TEXT,
  delivery_delay TEXT,
  delivery_cost TEXT,

  -- Statut
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mouvements de stock
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('in', 'out', 'adjustment', 'return')),
  quantity INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  reason TEXT,
  reference_id TEXT, -- ID de commande ou autre référence
  performed_by UUID REFERENCES public.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- SECTION 3: ORDERS & PAYMENTS
-- =============================================================================

-- Commandes
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,

  -- Informations client
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,

  -- Adresse de livraison
  shipping_address JSONB,

  -- Montants
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  loyalty_discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,

  -- Statut
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  payment_reference TEXT,

  -- Dates
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,

  -- Notes
  customer_notes TEXT,
  admin_notes TEXT,

  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles de commande
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_slug TEXT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- SECTION 4: REVIEWS & RATINGS
-- =============================================================================

-- Avis clients
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,

  -- Modération
  approved BOOLEAN DEFAULT false,
  flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  verified_purchase BOOLEAN DEFAULT false,

  -- Réponse de l'artisan/admin
  reply TEXT,
  reply_author TEXT,
  reply_date TIMESTAMPTZ,

  -- Historique de modération
  moderation_history JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- SECTION 5: MARKETING & PROMOTIONS
-- =============================================================================

-- Promotions
CREATE TABLE IF NOT EXISTS public.promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('percentage', 'fixed', 'free_shipping')),
  value DECIMAL(10,2) NOT NULL,
  min_purchase DECIMAL(10,2) DEFAULT 0,
  max_discount DECIMAL(10,2),

  -- Scope
  applicable_to TEXT[], -- product IDs, category slugs, or 'all'

  -- Limites
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  per_user_limit INTEGER DEFAULT 1,

  -- Dates
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,

  -- Statut
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Historique d'utilisation des promotions
CREATE TABLE IF NOT EXISTS public.promotion_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id UUID REFERENCES public.promotions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  discount_amount DECIMAL(10,2) NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flash Sales
CREATE TABLE IF NOT EXISTS public.flash_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  original_price DECIMAL(10,2) NOT NULL,
  flash_price DECIMAL(10,2) NOT NULL,
  discount_pct INTEGER NOT NULL,
  stock_allocated INTEGER NOT NULL,
  stock_remaining INTEGER NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cartes cadeaux
CREATE TABLE IF NOT EXISTS public.gift_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  initial_amount DECIMAL(10,2) NOT NULL,
  remaining_amount DECIMAL(10,2) NOT NULL,

  -- Destinataire
  recipient_name TEXT,
  recipient_email TEXT,
  recipient_address TEXT,
  message TEXT,

  -- Livraison
  delivery_type TEXT CHECK (delivery_type IN ('digital', 'physical')),
  email_sent_at TIMESTAMPTZ,

  -- Statut
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'spent', 'blocked', 'cancelled')),

  -- Expiration
  expires_at TIMESTAMPTZ,

  -- Origine
  issued_by TEXT DEFAULT 'customer' CHECK (issued_by IN ('customer', 'admin')),
  purchaser_id UUID REFERENCES public.users(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  redeemed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tickets cadeaux
CREATE TABLE IF NOT EXISTS public.gift_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,

  -- Type de réduction
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,

  -- Scope
  applicable_categories TEXT[],
  applicable_product_ids UUID[],

  -- Statut
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired', 'cancelled')),

  -- Attribution
  assigned_email TEXT,

  -- Dates
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,

  -- Origine
  issued_by TEXT DEFAULT 'system' CHECK (issued_by IN ('system', 'admin')),
  template_id UUID,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Concours
CREATE TABLE IF NOT EXISTS public.contests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  prize TEXT NOT NULL,
  prize_value DECIMAL(10,2),

  -- Type de concours
  type TEXT CHECK (type IN ('photo', 'story', 'vote', 'quiz', 'creative')),

  -- Dates
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  results_date TIMESTAMPTZ,

  -- Règles
  rules TEXT,
  max_entries_per_user INTEGER DEFAULT 1,

  -- Statut
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'voting', 'ended', 'cancelled')),

  -- Résultats
  winner_id UUID,
  winner_announced BOOLEAN DEFAULT false,

  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Participations aux concours
CREATE TABLE IF NOT EXISTS public.contest_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id UUID REFERENCES public.contests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  -- Soumission
  submission_type TEXT CHECK (submission_type IN ('photo', 'text', 'video', 'file')),
  submission_url TEXT,
  submission_text TEXT,

  -- Votes
  vote_count INTEGER DEFAULT 0,

  -- Statut
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'winner')),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes pour les concours
CREATE TABLE IF NOT EXISTS public.contest_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES public.contest_entries(id) ON DELETE CASCADE,
  voter_email TEXT NOT NULL,
  voter_ip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entry_id, voter_email)
);

-- Roue de la fortune - Configuration
CREATE TABLE IF NOT EXISTS public.wheel_prizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  type TEXT CHECK (type IN ('discount_pct', 'discount_fixed', 'gift_card', 'free_shipping', 'loyalty_points', 'lose')),
  value DECIMAL(10,2),
  probability DECIMAL(5,2) NOT NULL, -- probabilité en %
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roue de la fortune - Tours
CREATE TABLE IF NOT EXISTS public.wheel_spins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  prize_id UUID REFERENCES public.wheel_prizes(id) ON DELETE SET NULL,
  prize_label TEXT NOT NULL,
  prize_value DECIMAL(10,2),
  redeemed BOOLEAN DEFAULT false,
  redemption_code TEXT,
  expires_at TIMESTAMPTZ,
  spun_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jours de marché
CREATE TABLE IF NOT EXISTS public.market_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,

  -- Date de l'événement
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,

  -- Promotions spéciales
  featured_products UUID[], -- IDs de produits mis en avant
  special_discounts JSONB, -- [{category, discount_pct}, ...]

  -- Médias
  banner_url TEXT,

  -- Statut
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- SECTION 6: CONTENT (BLOG, EVENTS, FORMATIONS)
-- =============================================================================

-- Articles de blog
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  image_url TEXT,
  tags TEXT[],
  related_images TEXT[],

  -- SEO
  meta_description TEXT,

  -- Stats
  view_count INTEGER DEFAULT 0,
  read_time TEXT,

  -- Statut
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Événements
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  description TEXT,

  -- Dates
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,

  -- Lieu
  location TEXT,
  address TEXT,
  city TEXT,
  country TEXT,

  -- Médias
  image_url TEXT,

  -- Billetterie
  ticket_price DECIMAL(10,2),
  total_spots INTEGER,
  spots_left INTEGER,
  registration_required BOOLEAN DEFAULT false,

  -- Statut
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'past', 'cancelled')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inscriptions aux événements
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  number_of_tickets INTEGER DEFAULT 1,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  attended BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Formations
CREATE TABLE IF NOT EXISTS public.formations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  duration TEXT NOT NULL,
  mode TEXT CHECK (mode IN ('online', 'offline', 'hybrid')),

  -- Contenu
  description TEXT,
  objectives TEXT[],

  -- Prix
  price DECIMAL(10,2) NOT NULL,

  -- Médias
  image_url TEXT,

  -- Ratings
  rating DECIMAL(2,1) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,

  -- Prochaine session
  next_date TIMESTAMPTZ,

  -- Statut
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inscriptions aux formations
CREATE TABLE IF NOT EXISTS public.formation_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id UUID REFERENCES public.formations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  completion_status TEXT DEFAULT 'enrolled' CHECK (completion_status IN ('enrolled', 'in_progress', 'completed', 'dropped')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- SECTION 7: GALERIES & MEDIA
-- =============================================================================

-- Collections de galeries
CREATE TABLE IF NOT EXISTS public.gallery_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  theme TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  image_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Images de galerie
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES public.gallery_collections(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  artist TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bibliothèque média (admin)
CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT, -- image, video, document
  mime_type TEXT,
  file_size INTEGER,
  alt_text TEXT,
  caption TEXT,
  uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  folder TEXT DEFAULT 'uncategorized',
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- SECTION 8: ACHATS GROUPÉS (GROUP BUYING)
-- =============================================================================

-- Offres d'achats groupés
CREATE TABLE IF NOT EXISTS public.group_buying_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,

  -- Produit concerné
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  base_price DECIMAL(10,2) NOT NULL,

  -- Paliers de réduction
  tiers JSONB NOT NULL, -- [{min: 10, max: 19, discount: 15}, ...]

  -- Limites
  min_participants INTEGER NOT NULL,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,

  -- Dates
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,

  -- Statut
  status TEXT DEFAULT 'active' CHECK (status IN ('upcoming', 'active', 'success', 'failed', 'cancelled')),

  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Participations aux achats groupés
CREATE TABLE IF NOT EXISTS public.group_buying_participations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES public.group_buying_offers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  discount_applied DECIMAL(5,2),
  total_price DECIMAL(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- SECTION 9: MESSAGES & LEADS
-- =============================================================================

-- Messages de contact
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,

  -- Type
  type TEXT DEFAULT 'general' CHECK (type IN ('general', 'artisan_inquiry', 'partnership', 'complaint', 'other')),

  -- Statut
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),

  -- Réponse
  reply TEXT,
  replied_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  replied_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demandes d'adhésion artisan (leads)
CREATE TABLE IF NOT EXISTS public.artisan_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,

  -- Détails artisan
  specialty TEXT NOT NULL,
  experience_years INTEGER,
  location TEXT,
  current_production TEXT,

  -- Groupement souhaité
  preferred_groupement_id UUID REFERENCES public.groupements(id) ON DELETE SET NULL,

  -- Documents
  portfolio_url TEXT,
  certificates TEXT[],

  -- Statut
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),

  -- Notes admin
  admin_notes TEXT,
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- SECTION 10: ADMIN & AUDIT
-- =============================================================================

-- Journal d'audit
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT, -- 'product', 'order', 'user', etc.
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configuration du site (CMS)
CREATE TABLE IF NOT EXISTS public.site_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- INDEXES POUR PERFORMANCES
-- =============================================================================

-- Users & Loyalty
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_loyalty_accounts_user_id ON public.loyalty_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_account_id ON public.loyalty_transactions(account_id);

-- Products & Catalog
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_artisan_id ON public.products(artisan_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_artisans_slug ON public.artisans(slug);
CREATE INDEX IF NOT EXISTS idx_groupements_slug ON public.groupements(slug);

-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- Reviews
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.reviews(approved);

-- Marketing
CREATE INDEX IF NOT EXISTS idx_promotions_code ON public.promotions(code);
CREATE INDEX IF NOT EXISTS idx_promotions_is_active ON public.promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_flash_deals_product_id ON public.flash_deals(product_id);
CREATE INDEX IF NOT EXISTS idx_flash_deals_is_active ON public.flash_deals(is_active);
CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON public.gift_cards(code);
CREATE INDEX IF NOT EXISTS idx_gift_tickets_code ON public.gift_tickets(code);

-- Content
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
CREATE INDEX IF NOT EXISTS idx_formations_slug ON public.formations(slug);

-- Messages
CREATE INDEX IF NOT EXISTS idx_messages_status ON public.messages(status);
CREATE INDEX IF NOT EXISTS idx_artisan_leads_status ON public.artisan_leads(status);

-- Audit
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log(created_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Politique: Lecture publique des produits actifs
CREATE POLICY "Public can view active products" ON public.products
  FOR SELECT USING (is_active = true);

-- Politique: Lecture publique des avis approuvés
CREATE POLICY "Public can view approved reviews" ON public.reviews
  FOR SELECT USING (approved = true);

-- Politique: Users peuvent voir leurs propres commandes
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Politique: Users peuvent voir leur compte de fidélité
CREATE POLICY "Users can view own loyalty account" ON public.loyalty_accounts
  FOR SELECT USING (auth.uid() = user_id);

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Fonction: Mise à jour automatique du timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: updated_at pour toutes les tables concernées
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artisans_updated_at BEFORE UPDATE ON public.artisans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groupements_updated_at BEFORE UPDATE ON public.groupements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction: Calculer le rating moyen d'un produit
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM public.reviews
    WHERE product_id = NEW.product_id AND approved = true
  ),
  review_count = (
    SELECT COUNT(*)
    FROM public.reviews
    WHERE product_id = NEW.product_id AND approved = true
  )
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Recalculer le rating à chaque nouveau review approuvé
CREATE TRIGGER update_product_rating_on_review AFTER INSERT OR UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- =============================================================================
-- FIN DU SCHÉMA
-- =============================================================================

-- Ce schéma couvre toutes les fonctionnalités de l'application IPPOO KRAAFT:
-- ✅ Users, Loyalty, Referrals
-- ✅ Products, Artisans, Groupements, Categories
-- ✅ Orders, Payments
-- ✅ Reviews & Ratings
-- ✅ Marketing (Promotions, Flash Sales, Gift Cards, Tickets, Contests, Wheel, Market Days)
-- ✅ Content (Blog, Events, Formations)
-- ✅ Galleries & Media
-- ✅ Group Buying
-- ✅ Messages & Leads
-- ✅ Admin & Audit
