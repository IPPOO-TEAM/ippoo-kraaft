// IPPOO KRAAFT - Service Email Brevo (Sendinblue)
// Documentation: https://developers.brevo.com

import type { Order } from '../../app/hooks/use-payments';

export interface BrevoConfig {
  apiKey: string;
  senderEmail: string;
  senderName: string;
  apiUrl: string;
}

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface SendEmailParams {
  to: EmailRecipient[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  templateId?: number;
  params?: Record<string, any>;
}

/**
 * Récupère la configuration Brevo
 */
export function getBrevoConfig(): BrevoConfig {
  return {
    apiKey: import.meta.env.VITE_BREVO_API_KEY || '',
    senderEmail: import.meta.env.VITE_BREVO_SENDER_EMAIL || 'noreply@ippookraaft.com',
    senderName: import.meta.env.VITE_BREVO_SENDER_NAME || 'IPPOO KRAAFT',
    apiUrl: 'https://api.brevo.com/v3'
  };
}

/**
 * Envoyer un email via Brevo
 */
export async function sendEmail(params: SendEmailParams): Promise<{ ok: boolean; error?: string }> {
  const config = getBrevoConfig();

  if (!config.apiKey) {
    console.warn('[Brevo] API key not configured');
    return { ok: false, error: 'Configuration Brevo manquante' };
  }

  try {
    const response = await fetch(`${config.apiUrl}/smtp/email`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': config.apiKey
      },
      body: JSON.stringify({
        sender: {
          name: config.senderName,
          email: config.senderEmail
        },
        to: params.to,
        subject: params.subject,
        htmlContent: params.htmlContent,
        textContent: params.textContent,
        templateId: params.templateId,
        params: params.params
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('[Brevo] API error:', error);
      return {
        ok: false,
        error: error.message || `Erreur HTTP ${response.status}`
      };
    }

    return { ok: true };
  } catch (error) {
    console.error('[Brevo] Send error:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Erreur d\'envoi'
    };
  }
}

/**
 * Email de confirmation de commande
 */
export async function sendOrderConfirmationEmail(order: Order): Promise<{ ok: boolean; error?: string }> {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0D8A3E, #0057FF); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
    .order-details { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .item { padding: 10px 0; border-bottom: 1px solid #ddd; }
    .total { font-size: 18px; font-weight: bold; color: #0D8A3E; margin-top: 15px; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .button { display: inline-block; padding: 12px 24px; background: #0057FF; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎨 Merci pour votre commande !</h1>
    </div>

    <div class="content">
      <p>Bonjour ${order.customer.name || 'Cher client'},</p>

      <p>Nous avons bien reçu votre commande et nous vous en remercions !</p>

      <div class="order-details">
        <h2>Détails de la commande</h2>
        <p><strong>Numéro de commande:</strong> ${order.ref}</p>
        <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
        <p><strong>Statut:</strong> ${getStatusLabel(order.status)}</p>
        ${order.transactionId ? `<p><strong>Transaction ID:</strong> ${order.transactionId}</p>` : ''}

        <h3>Articles commandés:</h3>
        ${order.items.map(item => `
          <div class="item">
            <strong>${item.name}</strong><br>
            Quantité: ${item.quantity} × ${formatPrice(item.unitPrice)} Fcfa<br>
            Total: ${formatPrice(item.quantity * item.unitPrice)} Fcfa
          </div>
        `).join('')}

        <p class="total">Total: ${formatPrice(order.amount)} Fcfa</p>
      </div>

      <p>Vous recevrez un email de confirmation dès l'expédition de votre commande.</p>

      <a href="${window.location.origin}/commande/${order.ref}" class="button">
        Suivre ma commande
      </a>

      <p>Pour toute question, n'hésitez pas à nous contacter.</p>

      <p>Merci de votre confiance,<br><strong>L'équipe IPPOO KRAAFT</strong></p>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} IPPOO KRAAFT - Artisanat africain authentique</p>
      <p>
        <a href="${window.location.origin}">Boutique</a> |
        <a href="${window.location.origin}/contact">Contact</a> |
        <a href="${window.location.origin}/faq">FAQ</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: [{ email: order.customer.email || '', name: order.customer.name }],
    subject: `Commande ${order.ref} confirmée - IPPOO KRAAFT`,
    htmlContent
  });
}

/**
 * Email de notification d'expédition
 */
export async function sendShippingNotificationEmail(
  order: Order,
  trackingNumber?: string
): Promise<{ ok: boolean; error?: string }> {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0D8A3E, #0057FF); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
    .tracking { background: #f0f8ff; padding: 20px; border-left: 4px solid #0057FF; margin: 20px 0; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📦 Votre commande est en route !</h1>
    </div>

    <div class="content">
      <p>Bonjour ${order.customer.name || 'Cher client'},</p>

      <p>Bonne nouvelle ! Votre commande <strong>${order.ref}</strong> a été expédiée.</p>

      ${trackingNumber ? `
        <div class="tracking">
          <h3>Suivi de votre colis</h3>
          <p><strong>Numéro de suivi:</strong> ${trackingNumber}</p>
          <p>Vous pouvez suivre l'évolution de votre livraison en temps réel.</p>
        </div>
      ` : ''}

      <p>Vous recevrez votre colis sous peu. Merci de votre patience !</p>

      <p>Cordialement,<br><strong>L'équipe IPPOO KRAAFT</strong></p>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} IPPOO KRAAFT</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: [{ email: order.customer.email || '', name: order.customer.name }],
    subject: `Votre commande ${order.ref} a été expédiée - IPPOO KRAAFT`,
    htmlContent
  });
}

/**
 * Email de bienvenue
 */
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<{ ok: boolean; error?: string }> {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0D8A3E, #0057FF); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
    .button { display: inline-block; padding: 12px 24px; background: #0D8A3E; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎨 Bienvenue sur IPPOO KRAAFT !</h1>
    </div>

    <div class="content">
      <p>Bonjour ${name},</p>

      <p>Merci d'avoir rejoint IPPOO KRAAFT, votre plateforme de découverte et d'achat d'artisanat africain authentique !</p>

      <p>Nous sommes ravis de vous compter parmi nous. Découvrez dès maintenant:</p>

      <ul>
        <li>🎨 Plus de 50 produits artisanaux uniques</li>
        <li>👨‍🎨 Des artisans talentueux d'Afrique de l'Ouest</li>
        <li>📜 Des certifications d'authenticité</li>
        <li>🎁 Des offres exclusives et promotions</li>
      </ul>

      <a href="${window.location.origin}/boutique" class="button">
        Découvrir la boutique
      </a>

      <p>À très bientôt,<br><strong>L'équipe IPPOO KRAAFT</strong></p>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} IPPOO KRAAFT</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: [{ email, name }],
    subject: 'Bienvenue sur IPPOO KRAAFT ! 🎨',
    htmlContent
  });
}

/**
 * Email de réinitialisation de mot de passe
 */
export async function sendPasswordResetEmail(
  email: string,
  resetLink: string
): Promise<{ ok: boolean; error?: string }> {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px; }
    .button { display: inline-block; padding: 12px 24px; background: #0057FF; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <h2>Réinitialisation de mot de passe</h2>

      <p>Vous avez demandé à réinitialiser votre mot de passe IPPOO KRAAFT.</p>

      <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe:</p>

      <a href="${resetLink}" class="button">
        Réinitialiser mon mot de passe
      </a>

      <div class="warning">
        ⚠️ Ce lien est valable pendant 1 heure.<br>
        Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
      </div>

      <p>Cordialement,<br><strong>L'équipe IPPOO KRAAFT</strong></p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: [{ email }],
    subject: 'Réinitialisation de mot de passe - IPPOO KRAAFT',
    htmlContent
  });
}

// Utilitaires

function formatPrice(amount: number): string {
  return amount.toLocaleString('fr-FR');
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    created: 'Créée',
    processing: 'En traitement',
    succeeded: 'Confirmée',
    failed: 'Échec',
    refunded: 'Remboursée',
    expired: 'Expirée'
  };
  return labels[status] || status;
}
