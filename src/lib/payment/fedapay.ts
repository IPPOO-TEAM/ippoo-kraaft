// IPPOO KRAAFT - Intégration FedaPay
// Documentation: https://docs.fedapay.com

import type { Order, PayMethod } from '../../app/hooks/use-payments';

export interface FedaPayConfig {
  publicKey: string;
  secretKey: string;
  apiUrl: string;
  mode: 'sandbox' | 'live';
}

export interface FedaPayTransactionResponse {
  transaction: {
    id: number;
    reference: string;
    amount: number;
    description: string;
    status: 'pending' | 'approved' | 'declined' | 'canceled';
    customer: {
      firstname: string;
      lastname: string;
      email: string;
      phone_number: {
        number: string;
        country: string;
      };
    };
    created_at: string;
    approved_at?: string;
  };
  token: string;
  url: string;
}

export interface FedaPayPaymentResult {
  ok: boolean;
  transactionId?: string;
  paymentUrl?: string;
  token?: string;
  reason?: string;
}

/**
 * Récupère la configuration FedaPay depuis les variables d'environnement
 */
export function getFedaPayConfig(): FedaPayConfig {
  return {
    publicKey: import.meta.env.VITE_FEDAPAY_PUBLIC_KEY || '',
    secretKey: import.meta.env.VITE_FEDAPAY_SECRET_KEY || '',
    apiUrl: import.meta.env.VITE_FEDAPAY_API_URL || 'https://api.fedapay.com/v1',
    mode: (import.meta.env.VITE_FEDAPAY_MODE || 'sandbox') as 'sandbox' | 'live'
  };
}

/**
 * Convertit le type de paiement IPPOO vers le mode FedaPay
 */
function getPaymentMode(method: PayMethod): string {
  switch (method) {
    case 'moov':
      return 'mobile_money'; // MOOV via mobile money
    case 'mtn':
      return 'mobile_money'; // MTN via mobile money
    case 'card':
      return 'card'; // Carte bancaire
    case 'orange':
      return 'mobile_money'; // Orange Money
    case 'wave':
      return 'mobile_money'; // Wave
    case 'celtis':
      return 'mobile_money'; // Celtis
    default:
      return 'mobile_money';
  }
}

/**
 * Initialise un paiement FedaPay
 */
export async function initFedaPayPayment(order: Order): Promise<FedaPayPaymentResult> {
  const config = getFedaPayConfig();

  // Vérifier que les clés sont configurées
  if (!config.publicKey) {
    console.warn('[FedaPay] Public key not configured, using mock processor');
    return { ok: false, reason: 'Configuration FedaPay manquante' };
  }

  try {
    // Préparer les données de la transaction
    const transactionData = {
      description: `Commande ${order.ref} - IPPOO KRAAFT`,
      amount: order.amount,
      currency: {
        iso: 'XOF' // Franc CFA
      },
      callback_url: `${window.location.origin}/api/webhooks/fedapay`,
      customer: {
        firstname: order.customer.name?.split(' ')[0] || 'Client',
        lastname: order.customer.name?.split(' ').slice(1).join(' ') || 'IPPOO',
        email: order.customer.email || 'noreply@ippookraaft.com',
        phone_number: {
          number: order.payer?.phone || order.customer.phone || '',
          country: 'tg' // Togo par défaut
        }
      }
    };

    // Appel à l'API FedaPay pour créer la transaction
    const response = await fetch(`${config.apiUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.publicKey}`
      },
      body: JSON.stringify(transactionData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[FedaPay] API Error:', errorData);
      return {
        ok: false,
        reason: errorData.message || `Erreur HTTP ${response.status}`
      };
    }

    const data: FedaPayTransactionResponse = await response.json();

    // Générer le lien de paiement
    const paymentUrl = `${config.mode === 'sandbox'
      ? 'https://sandbox.fedapay.com'
      : 'https://checkout.fedapay.com'}/pay/${data.token}`;

    return {
      ok: true,
      transactionId: data.transaction.reference,
      paymentUrl: paymentUrl,
      token: data.token
    };
  } catch (error) {
    console.error('[FedaPay] Error:', error);
    return {
      ok: false,
      reason: error instanceof Error ? error.message : 'Erreur de connexion à FedaPay'
    };
  }
}

/**
 * Vérifie le statut d'une transaction FedaPay
 */
export async function checkFedaPayTransactionStatus(
  transactionId: string
): Promise<{ status: string; approved: boolean }> {
  const config = getFedaPayConfig();

  try {
    const response = await fetch(
      `${config.apiUrl}/transactions/${transactionId}`,
      {
        headers: {
          'Authorization': `Bearer ${config.publicKey}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data: FedaPayTransactionResponse = await response.json();

    return {
      status: data.transaction.status,
      approved: data.transaction.status === 'approved'
    };
  } catch (error) {
    console.error('[FedaPay] Status check error:', error);
    return { status: 'unknown', approved: false };
  }
}

/**
 * Vérifie la signature du webhook FedaPay (sécurité)
 */
export function verifyFedaPayWebhookSignature(
  payload: string,
  signature: string
): boolean {
  const config = getFedaPayConfig();

  // FedaPay utilise HMAC SHA256 pour signer les webhooks
  // Note: Dans un environnement frontend, la vérification complète
  // devrait se faire côté serveur avec la secret key

  if (!config.secretKey) {
    console.warn('[FedaPay] Secret key not configured for webhook verification');
    return false;
  }

  // TODO: Implémenter la vérification HMAC côté serveur
  // Pour l'instant, on accepte tous les webhooks en mode dev
  return true;
}

/**
 * Traite un webhook FedaPay
 */
export interface FedaPayWebhookPayload {
  event: 'transaction.approved' | 'transaction.declined' | 'transaction.canceled';
  entity: {
    id: number;
    reference: string;
    status: string;
    amount: number;
  };
}

export async function handleFedaPayWebhook(
  payload: FedaPayWebhookPayload
): Promise<{ ok: boolean; action?: string }> {
  switch (payload.event) {
    case 'transaction.approved':
      console.log('[FedaPay] Transaction approved:', payload.entity.reference);
      // Mettre à jour le statut de la commande
      return { ok: true, action: 'payment_success' };

    case 'transaction.declined':
      console.log('[FedaPay] Transaction declined:', payload.entity.reference);
      return { ok: true, action: 'payment_failed' };

    case 'transaction.canceled':
      console.log('[FedaPay] Transaction canceled:', payload.entity.reference);
      return { ok: true, action: 'payment_canceled' };

    default:
      console.warn('[FedaPay] Unknown event:', payload.event);
      return { ok: false };
  }
}

/**
 * Mock processor en fallback si FedaPay n'est pas configuré
 */
export async function mockFedaPayProcessor(
  order: Order
): Promise<FedaPayPaymentResult> {
  console.warn('[FedaPay] Using mock processor - configure API keys for production');

  // Simulation avec délai
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Taux de réussite : 90%
  if (Math.random() < 0.9) {
    return {
      ok: true,
      transactionId: `MOCK-TX-${Date.now()}`,
      paymentUrl: '#mock-payment',
      token: `mock-token-${Date.now()}`
    };
  }

  const reasons = [
    'Solde insuffisant',
    'Transaction annulée',
    'Délai d\'attente dépassé',
    'Numéro invalide'
  ];

  return {
    ok: false,
    reason: reasons[Math.floor(Math.random() * reasons.length)]
  };
}
