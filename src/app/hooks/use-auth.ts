import { useMemo } from "react";
import { useUser } from "./use-user";
import { useAdmin } from "./use-admin";

export type Role = "admin" | "artisan" | "entreprise" | "client" | "guest";

export interface AuthState {
  role: Role;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isArtisan: boolean;
  isClient: boolean;
  isGuest: boolean;
  /** Identifiant logique unique (admin id ou user id) */
  principalId: string | null;
  /** Nom affichable */
  displayName: string | null;
  /** Email si disponible */
  email: string | null;
  /** Avatar / photo si disponible */
  avatar: string | null;
}

/**
 * Façade unifiée au-dessus de useUser + useAdmin.
 * Ne réécrit pas les providers — agrège leurs états et expose un rôle calculé.
 *
 * Règles de précédence :
 *   1. Si une session admin valide existe → role = "admin"
 *   2. Sinon si user.accountType = "artisan" → role = "artisan"
 *   3. Sinon si user.accountType = "entreprise" → role = "entreprise"
 *   4. Sinon si user existe → role = "client"
 *   5. Sinon → role = "guest"
 */
export function useAuth(): AuthState {
  const { user } = useUser();
  const { session } = useAdmin();

  return useMemo<AuthState>(() => {
    if (session && session.role === "admin") {
      return {
        role: "admin",
        isAuthenticated: true,
        isAdmin: true,
        isArtisan: false,
        isClient: false,
        isGuest: false,
        principalId: `admin-${session.username}`,
        displayName: session.username,
        email: null,
        avatar: null,
      };
    }
    if (user) {
      const role: Role = user.accountType === "artisan"
        ? "artisan"
        : user.accountType === "entreprise"
          ? "entreprise"
          : "client";
      return {
        role,
        isAuthenticated: true,
        isAdmin: false,
        isArtisan: role === "artisan",
        isClient: role === "client" || role === "entreprise",
        isGuest: false,
        principalId: user.id,
        displayName: user.fullName,
        email: user.email,
        avatar: user.profilePhoto || null,
      };
    }
    return {
      role: "guest",
      isAuthenticated: false,
      isAdmin: false,
      isArtisan: false,
      isClient: false,
      isGuest: true,
      principalId: null,
      displayName: null,
      email: null,
      avatar: null,
    };
  }, [user, session]);
}

/** Garde-fou : retourne true si le rôle courant a accès à une zone donnée. */
export function canAccess(role: Role, zone: "admin" | "espace-artisan" | "compte"): boolean {
  if (zone === "admin") return role === "admin";
  if (zone === "espace-artisan") return role === "artisan" || role === "entreprise";
  if (zone === "compte") return role !== "guest";
  return false;
}
