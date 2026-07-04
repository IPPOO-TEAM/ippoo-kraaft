import { createBrowserRouter, Navigate, Outlet, ScrollRestoration } from "react-router";
import { Layout } from "./components/layout";
import { HomePage } from "./components/home-page";
import { RouteErrorBoundary } from "./components/route-error-boundary";
import { VerifSupabase } from "./pages/verif-supabase";
import { TestBasique } from "./pages/test-basique";

// Affiché par react-router pendant l'hydratation initiale des routes lazy.
function RouteHydrateFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Racine commune à toutes les routes. <ScrollRestoration> remonte en haut lors
// d'une nouvelle navigation (PUSH) et RESTAURE la position précédente lors d'un
// retour/avance navigateur (POP).
function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}

// Preload critical artisan components to avoid dynamic import issues
import {
  ArtisanLayout,
  ArtisanDashboardPage,
  ArtisanShopPage,
  ArtisanProductsPage,
  ArtisanProductEditorPage,
  ArtisanOrdersPage,
  ArtisanMessagesPage,
  ArtisanNotificationsPage,
  ArtisanProfilePage,
} from "./components/artisan/artisan-space";

const lazyNamed = <T extends string>(loader: () => Promise<Record<string, unknown>>, name: T) =>
  async () => {
    try {
      const mod = await loader();
      const Component = mod[name] as React.ComponentType;
      if (!Component) {
        console.error(`Component "${name}" not found in module:`, mod);
        throw new Error(`Component "${name}" not found`);
      }
      return { Component };
    } catch (error) {
      console.error(`Failed to load component "${name}":`, error);
      throw error;
    }
  };

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    errorElement: <RouteErrorBoundary />,
    HydrateFallback: RouteHydrateFallback,
    children: [
  {
    // Ancien chemin conservé : redirige vers la landing désormais à la racine.
    path: "/landing",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/admin/login",
    lazy: lazyNamed(() => import("./components/admin/standalone-login"), "StandaloneAdminLoginPage"),
    errorElement: <RouteErrorBoundary />,
    HydrateFallback: RouteHydrateFallback,
  },
  {
    path: "/espace-artisan",
    Component: ArtisanLayout,
    errorElement: <RouteErrorBoundary />,
    HydrateFallback: RouteHydrateFallback,
    children: [
      { index: true, Component: ArtisanDashboardPage },
      { path: "boutique", Component: ArtisanShopPage },
      { path: "produits", Component: ArtisanProductsPage },
      { path: "produits/:id", Component: ArtisanProductEditorPage },
      { path: "commandes", Component: ArtisanOrdersPage },
      { path: "messages", Component: ArtisanMessagesPage },
      { path: "notifications", Component: ArtisanNotificationsPage },
      { path: "profil", Component: ArtisanProfilePage },
    ],
  },
  {
    path: "/admin",
    lazy: lazyNamed(() => import("./components/admin/admin-layout"), "AdminLayout"),
    errorElement: <RouteErrorBoundary />,
    HydrateFallback: RouteHydrateFallback,
    children: [
      { index: true, lazy: lazyNamed(() => import("./components/admin/admin-dashboard"), "AdminDashboardPage") },
      { path: "produits", lazy: lazyNamed(() => import("./components/admin/admin-products"), "AdminProductsPage") },
      { path: "categories", lazy: lazyNamed(() => import("./components/admin/admin-categories"), "AdminCategoriesPage") },
      { path: "stocks", lazy: lazyNamed(() => import("./components/admin/admin-stock-movements"), "AdminStockMovementsPage") },
      { path: "commandes", lazy: lazyNamed(() => import("./components/admin/admin-orders"), "AdminOrdersPage") },
      { path: "avis", lazy: lazyNamed(() => import("./components/admin/admin-reviews"), "AdminReviewsPage") },
      { path: "artisans", lazy: lazyNamed(() => import("./components/admin/admin-catalog"), "AdminArtisansPage") },
      { path: "groupements", lazy: lazyNamed(() => import("./components/admin/admin-catalog"), "AdminGroupementsPage") },
      { path: "formations", lazy: lazyNamed(() => import("./components/admin/admin-catalog"), "AdminFormationsPage") },
      { path: "evenements", lazy: lazyNamed(() => import("./components/admin/admin-content"), "AdminEventsPage") },
      { path: "blog", lazy: lazyNamed(() => import("./components/admin/admin-content"), "AdminBlogPage") },
      { path: "achats-groupes", lazy: lazyNamed(() => import("./components/admin/admin-content"), "AdminGroupBuyingPage") },
      { path: "messages", lazy: lazyNamed(() => import("./components/admin/admin-misc"), "AdminMessagesPage") },
      { path: "leads", lazy: lazyNamed(() => import("./components/admin/admin-leads"), "AdminLeadsPage") },
      { path: "marketing", lazy: lazyNamed(() => import("./components/admin/admin-marketing"), "AdminMarketingPage") },
      { path: "media", lazy: lazyNamed(() => import("./components/admin/media-library"), "AdminMediaPage") },
      { path: "cms", lazy: lazyNamed(() => import("./components/admin/admin-cms"), "AdminCmsPage") },
      { path: "parametres", lazy: lazyNamed(() => import("./components/admin/admin-misc"), "AdminSettingsPage") },
      { path: "supabase", lazy: lazyNamed(() => import("./pages/admin/supabase-dashboard"), "SupabaseDashboard") },
      { path: "journal", lazy: lazyNamed(() => import("./components/admin/admin-misc"), "AdminAuditPage") },
    ],
  },
  {
    path: "/",
    errorElement: <RouteErrorBoundary />,
    HydrateFallback: RouteHydrateFallback,
    children: [
      // La landing est désormais l'état principal de navigation (racine, sans le Layout applicatif).
      { index: true, lazy: lazyNamed(() => import("./components/landing-page"), "LandingPage") },
      // L'application complète vit sous le Layout ; l'accueil applicatif passe sur /accueil.
      {
        Component: Layout,
        children: [
          { path: "accueil", Component: HomePage },
          { path: "verif-supabase", Component: VerifSupabase },
      { path: "test-basique", Component: TestBasique },
      { path: "boutique", lazy: lazyNamed(() => import("./components/boutique-page"), "BoutiquePage") },
      { path: "boutique/:slug", lazy: lazyNamed(() => import("./components/product-detail-page"), "ProductDetailPage") },
      { path: "artisan/:slug", lazy: lazyNamed(() => import("./components/artisan-public-page"), "ArtisanPublicPage") },
      { path: "niche/:slug", lazy: lazyNamed(() => import("./components/niche-page"), "NichePage") },
      { path: "niche/:slug/*", lazy: lazyNamed(() => import("./components/niche-page"), "NichePage") },
      { path: "repertoire", lazy: lazyNamed(() => import("./components/repertoire-page"), "RepertoirePage") },
      { path: "metiers", lazy: lazyNamed(() => import("./components/metiers-page"), "MetiersPage") },
      { path: "metiers/:slug", lazy: lazyNamed(() => import("./components/metiers-page"), "MetierDetailPage") },
      { path: "salons", lazy: lazyNamed(() => import("./components/kraaft-events-page"), "SalonsPage") },
      { path: "salons/:slug", lazy: lazyNamed(() => import("./components/kraaft-events-page"), "SalonDetailPage") },
      { path: "arts-culture", lazy: lazyNamed(() => import("./components/arts-culture-page"), "ArtsCulturePage") },
      { path: "arts-culture/:slug", lazy: lazyNamed(() => import("./components/arts-culture-page"), "ArtDetailPage") },
      { path: "medias", lazy: lazyNamed(() => import("./components/culture-media-page"), "MediasPage") },
      { path: "medias/:slug", lazy: lazyNamed(() => import("./components/culture-media-page"), "MediaRubriquePage") },
      { path: "patrimoines", lazy: lazyNamed(() => import("./components/patrimoine-page"), "PatrimoinePage") },
      { path: "patrimoines/:slug", lazy: lazyNamed(() => import("./components/patrimoine-page"), "PatrimoineSectionPage") },
      { path: "marketplace", lazy: lazyNamed(() => import("./components/marketplace-page"), "MarketplacePage") },
      { path: "marketplace/:slug", lazy: lazyNamed(() => import("./components/marketplace-page"), "MarketplaceSectionPage") },
      { path: "dialogues", lazy: lazyNamed(() => import("./components/heritage-dialogues-page"), "DialoguesPage") },
      { path: "dialogues/:slug", lazy: lazyNamed(() => import("./components/heritage-dialogues-page"), "DialogueDetailPage") },
      { path: "academie", lazy: lazyNamed(() => import("./components/academie-page"), "AcademiePage") },
      { path: "galeries", lazy: lazyNamed(() => import("./components/galleries-page"), "GalleriesPage") },
      { path: "galeries/:slug", lazy: lazyNamed(() => import("./components/galleries-page"), "GalleryDetailPage") },
      { path: "groupements", lazy: lazyNamed(() => import("./components/groupements-page"), "GroupementsPage") },
      { path: "groupements/:slug", lazy: lazyNamed(() => import("./components/groupements-page"), "GroupementDetailPage") },
      { path: "formations", lazy: lazyNamed(() => import("./components/formations-page"), "FormationsPage") },
      { path: "formations/:slug", lazy: lazyNamed(() => import("./components/formations-page"), "FormationDetailPage") },
      { path: "a-propos", lazy: lazyNamed(() => import("./components/content-pages"), "AboutPage") },
      { path: "contact", lazy: lazyNamed(() => import("./components/content-pages"), "ContactPage") },
      { path: "faq", lazy: lazyNamed(() => import("./components/content-pages"), "FAQPage") },
      { path: "blog", lazy: lazyNamed(() => import("./components/blog-page"), "BlogPage") },
      { path: "blog/:slug", lazy: lazyNamed(() => import("./components/blog-page"), "BlogDetailPage") },
      { path: "evenements", lazy: lazyNamed(() => import("./components/content-pages"), "EventsPage") },
      { path: "evenements/:slug", lazy: lazyNamed(() => import("./components/content-pages"), "EventsPage") },
      { path: "statistiques", lazy: lazyNamed(() => import("./components/content-pages"), "StatsPage") },
      { path: "devenir-artisan", lazy: lazyNamed(() => import("./components/content-pages"), "JoinArtisanPage") },
      { path: "panier", lazy: lazyNamed(() => import("./components/content-pages"), "CartPage") },
      { path: "commande/:ref", lazy: lazyNamed(() => import("./components/content-pages"), "OrderConfirmationPage") },
      { path: "promotions", lazy: lazyNamed(() => import("./components/content-pages"), "PromotionsPage") },
      { path: "flash", lazy: lazyNamed(() => import("./components/content-pages"), "FlashPage") },
      { path: "concours", lazy: lazyNamed(() => import("./components/content-pages"), "ConcoursPage") },
      { path: "concours/:id/resultats", lazy: lazyNamed(() => import("./components/content-pages"), "ContestResultsPage") },
      { path: "roue", lazy: lazyNamed(() => import("./components/content-pages"), "WheelPage") },
      { path: "carte-cadeau", lazy: lazyNamed(() => import("./components/content-pages"), "GiftCardPage") },
      { path: "tickets-cadeaux", lazy: lazyNamed(() => import("./components/content-pages"), "GiftTicketsPage") },
      { path: "jour-de-marche", lazy: lazyNamed(() => import("./components/content-pages"), "MarketDayPage") },
      { path: "compte", lazy: lazyNamed(() => import("./components/content-pages"), "AccountPage") },
      { path: "connexion", lazy: lazyNamed(() => import("./components/auth-pages"), "LoginPage") },
      { path: "inscription", lazy: lazyNamed(() => import("./components/auth-pages"), "SignupPage") },
      { path: "completer-profil", lazy: lazyNamed(() => import("./components/auth-pages"), "CompleteProfilePage") },
      { path: "mot-de-passe-oublie", lazy: lazyNamed(() => import("./components/auth-pages"), "ForgotPasswordPage") },
      { path: "reinitialiser-mot-de-passe", lazy: lazyNamed(() => import("./components/auth-pages"), "ResetPasswordPage") },
      { path: "verifier-email", lazy: lazyNamed(() => import("./components/auth-pages"), "VerifyEmailPage") },
      { path: "favoris", lazy: lazyNamed(() => import("./components/content-pages"), "FavoritesPage") },
      { path: "achats-groupes", lazy: lazyNamed(() => import("./components/group-buying-page"), "GroupBuyingPage") },
      { path: "achats-groupes/:slug", lazy: lazyNamed(() => import("./components/group-buying-page"), "GroupBuyingDetailPage") },
      { path: "legal/:section", lazy: lazyNamed(() => import("./components/content-pages"), "LegalPage") },
      { path: "*", lazy: lazyNamed(() => import("./components/content-pages"), "NotFoundPage") },
        ],
      },
    ],
  },
    ],
  },
]);
