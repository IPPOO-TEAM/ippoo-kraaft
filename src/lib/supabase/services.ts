// IPPOO KRAAFT - Services Supabase Backend
// Services pour toutes les fonctionnalités de l'application

import { supabase } from '../supabase';
import type { Product, Artisan, Groupement, Formation, BlogArticle, Event } from '../../app/data/mock-data';

// =============================================================================
// PRODUCTS & CATALOG
// =============================================================================

export const productsService = {
  // Récupérer tous les produits actifs
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Récupérer un produit par slug
  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  // Récupérer produits par catégorie
  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('is_active', true);

    if (error) throw error;
    return data;
  },

  // Rechercher des produits
  async search(query: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${query}%`)
      .eq('is_active', true)
      .limit(20);

    if (error) throw error;
    return data;
  },

  // Créer un nouveau produit
  async create(product: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mettre à jour un produit
  async update(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Supprimer un produit
  async delete(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Mettre à jour le stock
  async updateStock(id: string, newStock: number) {
    const { data, error } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// =============================================================================
// ARTISANS
// =============================================================================

export const artisansService = {
  async getAll() {
    const { data, error } = await supabase
      .from('artisans')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('artisans')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  async create(artisan: Partial<Artisan>) {
    const { data, error } = await supabase
      .from('artisans')
      .insert(artisan)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Artisan>) {
    const { data, error} = await supabase
      .from('artisans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// =============================================================================
// GROUPEMENTS
// =============================================================================

export const groupementsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('groupements')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('groupements')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  }
};

// =============================================================================
// ORDERS
// =============================================================================

export const ordersService = {
  // Créer une nouvelle commande
  async create(orderData: any) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) throw orderError;

    return order;
  },

  // Ajouter des articles à une commande
  async addItems(orderId: string, items: any[]) {
    const { data, error } = await supabase
      .from('order_items')
      .insert(items.map(item => ({ ...item, order_id: orderId })))
      .select();

    if (error) throw error;
    return data;
  },

  // Récupérer les commandes d'un utilisateur
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Récupérer une commande par numéro
  async getByNumber(orderNumber: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('order_number', orderNumber)
      .single();

    if (error) throw error;
    return data;
  },

  // Mettre à jour le statut d'une commande
  async updateStatus(orderId: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Récupérer toutes les commandes (admin)
  async getAll(filters?: { status?: string; from?: string; to?: string }) {
    let query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.from) {
      query = query.gte('created_at', filters.from);
    }

    if (filters?.to) {
      query = query.lte('created_at', filters.to);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
};

// =============================================================================
// REVIEWS
// =============================================================================

export const reviewsService = {
  // Récupérer les avis d'un produit
  async getByProduct(productId: string, approvedOnly = true) {
    let query = supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (approvedOnly) {
      query = query.eq('approved', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Créer un nouvel avis
  async create(review: any) {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Approuver un avis
  async approve(reviewId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .update({ approved: true })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Signaler un avis
  async flag(reviewId: string, reason: string) {
    const { data, error } = await supabase
      .from('reviews')
      .update({ flagged: true, flag_reason: reason })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Répondre à un avis
  async reply(reviewId: string, replyText: string, author: string) {
    const { data, error } = await supabase
      .from('reviews')
      .update({
        reply: replyText,
        reply_author: author,
        reply_date: new Date().toISOString()
      })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// =============================================================================
// LOYALTY
// =============================================================================

export const loyaltyService = {
  // Récupérer le compte de fidélité d'un utilisateur
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('loyalty_accounts')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Créer un compte de fidélité
  async create(userId: string, email: string) {
    const { data, error } = await supabase
      .from('loyalty_accounts')
      .insert({ user_id: userId, email, points: 0 })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Ajouter des points
  async addPoints(accountId: string, points: number, reason: string, referenceId?: string) {
    // Ajouter la transaction
    const { error: txnError } = await supabase
      .from('loyalty_transactions')
      .insert({
        account_id: accountId,
        delta: points,
        reason,
        reference_id: referenceId
      });

    if (txnError) throw txnError;

    // Mettre à jour le solde
    const { data: account } = await supabase
      .from('loyalty_accounts')
      .select('points')
      .eq('id', accountId)
      .single();

    const { data, error } = await supabase
      .from('loyalty_accounts')
      .update({ points: (account?.points || 0) + points })
      .eq('id', accountId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Dépenser des points
  async spendPoints(accountId: string, points: number, reason: string) {
    return this.addPoints(accountId, -points, reason);
  },

  // Récupérer l'historique
  async getTransactions(accountId: string) {
    const { data, error } = await supabase
      .from('loyalty_transactions')
      .select('*')
      .eq('account_id', accountId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};

// =============================================================================
// MARKETING
// =============================================================================

export const promotionsService = {
  // Récupérer toutes les promotions actives
  async getActive() {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('is_active', true)
      .lte('start_date', now)
      .or(`end_date.is.null,end_date.gte.${now}`);

    if (error) throw error;
    return data;
  },

  // Valider un code promo
  async validateCode(code: string) {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .lte('start_date', now)
      .or(`end_date.is.null,end_date.gte.${now}`)
      .single();

    if (error) throw error;
    return data;
  },

  // Utiliser une promotion
  async use(promotionId: string, userId: string | null, orderId: string, discountAmount: number) {
    const { error } = await supabase
      .from('promotion_usages')
      .insert({
        promotion_id: promotionId,
        user_id: userId,
        order_id: orderId,
        discount_amount: discountAmount
      });

    if (error) throw error;

    // Incrémenter le compteur d'utilisation
    await supabase.rpc('increment_promotion_usage', { promo_id: promotionId });
  }
};

export const giftCardsService = {
  // Valider une carte cadeau
  async validate(code: string) {
    const { data, error } = await supabase
      .from('gift_cards')
      .select('*')
      .eq('code', code)
      .eq('status', 'active')
      .single();

    if (error) throw error;

    // Vérifier l'expiration
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      throw new Error('Cette carte cadeau a expiré');
    }

    return data;
  },

  // Utiliser une carte cadeau
  async use(cardId: string, amount: number) {
    const { data: card } = await supabase
      .from('gift_cards')
      .select('remaining_amount')
      .eq('id', cardId)
      .single();

    if (!card || card.remaining_amount < amount) {
      throw new Error('Solde insuffisant sur la carte cadeau');
    }

    const newRemaining = card.remaining_amount - amount;
    const { data, error } = await supabase
      .from('gift_cards')
      .update({
        remaining_amount: newRemaining,
        status: newRemaining === 0 ? 'spent' : 'active',
        redeemed_at: new Date().toISOString()
      })
      .eq('id', cardId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// =============================================================================
// BLOG & CONTENT
// =============================================================================

export const blogService = {
  async getAll(status = 'published') {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', status)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) throw error;

    // Incrémenter le compteur de vues
    await supabase.rpc('increment_blog_views', { post_id: data.id });

    return data;
  },

  async create(post: Partial<BlogArticle>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(post)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const eventsService = {
  async getUpcoming() {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('start_date', now)
      .eq('status', 'upcoming')
      .order('start_date');

    if (error) throw error;
    return data;
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  }
};

export const formationsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('formations')
      .select('*')
      .eq('is_active', true)
      .order('title');

    if (error) throw error;
    return data;
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('formations')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  }
};

// =============================================================================
// MESSAGES & LEADS
// =============================================================================

export const messagesService = {
  async create(message: any) {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll(status?: string) {
    let query = supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async updateStatus(messageId: string, status: string) {
    const { data, error } = await supabase
      .from('messages')
      .update({ status })
      .eq('id', messageId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const artisanLeadsService = {
  async create(lead: any) {
    const { data, error } = await supabase
      .from('artisan_leads')
      .insert(lead)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll(status?: string) {
    let query = supabase
      .from('artisan_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async updateStatus(leadId: string, status: string, notes?: string) {
    const { data, error } = await supabase
      .from('artisan_leads')
      .update({ status, admin_notes: notes, reviewed_at: new Date().toISOString() })
      .eq('id', leadId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// =============================================================================
// AUDIT
// =============================================================================

export const auditService = {
  async log(action: string, entityType: string, entityId: string, details?: any, userId?: string) {
    const { error } = await supabase
      .from('audit_log')
      .insert({
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        details
      });

    if (error) console.error('Audit log error:', error);
  },

  async getRecent(limit = 100) {
    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
};

// Export all services
export const supabaseServices = {
  products: productsService,
  artisans: artisansService,
  groupements: groupementsService,
  orders: ordersService,
  reviews: reviewsService,
  loyalty: loyaltyService,
  promotions: promotionsService,
  giftCards: giftCardsService,
  blog: blogService,
  events: eventsService,
  formations: formationsService,
  messages: messagesService,
  artisanLeads: artisanLeadsService,
  audit: auditService
};

export default supabaseServices;
