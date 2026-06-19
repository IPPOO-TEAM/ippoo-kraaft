// IPPOO KRAAFT - Wrapper Supabase Auth
// Migration de l'authentification localStorage vers Supabase Auth

import { supabase } from '../supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar_url?: string;
  role: 'customer' | 'artisan' | 'admin';
  emailVerified: boolean;
  createdAt: string;
}

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  dateOfBirth?: string;
  sex?: 'homme' | 'femme' | 'autre';
  address?: string;
  countryCode?: string;
  nationality?: string;
  accountType?: 'particulier' | 'artisan' | 'entreprise';
  niches?: string[];
}

export interface AuthResult {
  ok: boolean;
  user?: AuthUser;
  error?: string;
  needsEmailVerification?: boolean;
}

/**
 * Inscription d'un nouvel utilisateur
 */
export async function signUp(data: SignupData): Promise<AuthResult> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          phone: data.phone,
          account_type: data.accountType || 'particulier'
        },
        emailRedirectTo: `${window.location.origin}/verifier-email`
      }
    });

    if (authError) {
      return { ok: false, error: authError.message };
    }

    if (!authData.user) {
      return { ok: false, error: 'Erreur lors de la création du compte' };
    }

    // Créer le profil utilisateur dans la table public.users
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: data.email,
        full_name: data.fullName,
        phone: data.phone,
        role: data.accountType === 'artisan' ? 'artisan' : 'customer',
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('[Auth] Profile creation error:', profileError);
      // On continue quand même, le profil peut être créé plus tard
    }

    return {
      ok: true,
      needsEmailVerification: true,
      user: {
        id: authData.user.id,
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        role: 'customer',
        emailVerified: false,
        createdAt: authData.user.created_at
      }
    };
  } catch (error) {
    console.error('[Auth] Signup error:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

/**
 * Connexion d'un utilisateur
 */
export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    if (!data.user) {
      return { ok: false, error: 'Identifiants invalides' };
    }

    // Charger le profil utilisateur
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('[Auth] Profile loading error:', profileError);
      // Continuer quand même avec les données de base
    }

    return {
      ok: true,
      user: {
        id: data.user.id,
        email: data.user.email!,
        fullName: profile?.full_name || data.user.user_metadata?.full_name || 'Utilisateur',
        phone: profile?.phone || data.user.user_metadata?.phone,
        avatar_url: profile?.avatar_url || data.user.user_metadata?.avatar_url,
        role: profile?.role || 'customer',
        emailVerified: data.user.email_confirmed_at !== null,
        createdAt: data.user.created_at
      }
    };
  } catch (error) {
    console.error('[Auth] Signin error:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Erreur de connexion'
    };
  }
}

/**
 * Déconnexion
 */
export async function signOut(): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (error) {
    console.error('[Auth] Signout error:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Erreur de déconnexion'
    };
  }
}

/**
 * Obtenir la session actuelle
 */
export async function getSession(): Promise<{ session: Session | null; user?: AuthUser }> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return { session: null };
    }

    // Charger le profil
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    return {
      session,
      user: profile ? {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        phone: profile.phone,
        avatar_url: profile.avatar_url,
        role: profile.role,
        emailVerified: session.user.email_confirmed_at !== null,
        createdAt: profile.created_at
      } : undefined
    };
  } catch (error) {
    console.error('[Auth] Get session error:', error);
    return { session: null };
  }
}

/**
 * Mettre à jour le profil utilisateur
 */
export async function updateProfile(
  userId: string,
  updates: Partial<AuthUser>
): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        full_name: updates.fullName,
        phone: updates.phone,
        avatar_url: updates.avatar_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (error) {
    console.error('[Auth] Update profile error:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Erreur de mise à jour'
    };
  }
}

/**
 * Demander une réinitialisation de mot de passe
 */
export async function requestPasswordReset(email: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe`
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (error) {
    console.error('[Auth] Password reset request error:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la demande'
    };
  }
}

/**
 * Réinitialiser le mot de passe
 */
export async function resetPassword(newPassword: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (error) {
    console.error('[Auth] Password reset error:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la réinitialisation'
    };
  }
}

/**
 * Demander une vérification d'email
 */
export async function requestEmailVerification(): Promise<{ ok: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { ok: false, error: 'Utilisateur non connecté' };
    }

    // Supabase envoie automatiquement un email lors de l'inscription
    // Pour renvoyer un email de vérification :
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email!
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (error) {
    console.error('[Auth] Email verification request error:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la demande'
    };
  }
}

/**
 * Connexion avec Google OAuth
 */
export async function signInWithGoogle(): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/completer-profil`
      }
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (error) {
    console.error('[Auth] Google signin error:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Erreur de connexion Google'
    };
  }
}

/**
 * Écouter les changements d'authentification
 */
export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}
