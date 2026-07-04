import { useEffect, Suspense } from "react";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { router } from "./routes";
import { ErrorBoundary } from "./components/error-boundary";
import { StoreProvider } from "./hooks/use-store";
import { AdminProvider } from "./hooks/use-admin";
import { ConfirmProvider } from "./hooks/use-confirm";
import { SyncProvider } from "./hooks/use-sync-queue";
import { AlertWebhookProvider } from "./hooks/use-alert-webhook";
import { UserProvider } from "./hooks/use-user";
import { PaymentsProvider } from "./hooks/use-payments";
import { MarketingProvider } from "./hooks/use-marketing";
import { NotificationsProvider } from "./hooks/use-notifications";
import { MediaProvider } from "./hooks/use-media";
import { CmsProvider } from "./hooks/use-cms";
import { BackgroundMusicProvider } from "./hooks/use-background-music";

// Fallback component for initial hydration and lazy loading
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    </div>
  );
}

// IPPOO KRAAFT - racine de l'application. Stack de providers : admin → sync → webhooks
// → confirm → store → user → payments → marketing, puis le RouterProvider.
function AppRoot() {
  useEffect(() => {
    // PWA status bar / browser chrome : même couleur que le header IPPOO KRAAFT.
    const setThemeColor = (color: string) => {
      let el = document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", "theme-color");
        document.head.appendChild(el);
      }
      el.setAttribute("content", color);
      // iOS Safari
      let iosMeta = document.head.querySelector<HTMLMetaElement>('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (!iosMeta) {
        iosMeta = document.createElement("meta");
        iosMeta.setAttribute("name", "apple-mobile-web-app-status-bar-style");
        document.head.appendChild(iosMeta);
      }
      iosMeta.setAttribute("content", "black-translucent");
      // Manifest dynamique
      let manifestEl = document.head.querySelector<HTMLMetaElement>('meta[name="msapplication-navbutton-color"]');
      if (!manifestEl) {
        manifestEl = document.createElement("meta");
        manifestEl.setAttribute("name", "msapplication-navbutton-color");
        document.head.appendChild(manifestEl);
      }
      manifestEl.setAttribute("content", color);
    };
    setThemeColor("#C8F74A");

    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    const isProdLike = window.location.protocol.startsWith("http") && !window.location.hostname.includes("figma");
    if (!isProdLike) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return (
    <ErrorBoundary>
      <AdminProvider>
        <SyncProvider>
          <AlertWebhookProvider>
            <ConfirmProvider>
              <StoreProvider>
                <UserProvider>
                  <PaymentsProvider>
                    <MarketingProvider>
                      <NotificationsProvider>
                        <MediaProvider>
                          <CmsProvider>
                            <BackgroundMusicProvider>
                              <Suspense fallback={<LoadingFallback />}>
                                <RouterProvider
                                  router={router}
                                  fallbackElement={<LoadingFallback />}
                                />
                              </Suspense>
                              <Toaster position="top-center" richColors />
                            </BackgroundMusicProvider>
                          </CmsProvider>
                        </MediaProvider>
                      </NotificationsProvider>
                    </MarketingProvider>
                  </PaymentsProvider>
                </UserProvider>
              </StoreProvider>
            </ConfirmProvider>
          </AlertWebhookProvider>
        </SyncProvider>
      </AdminProvider>
    </ErrorBoundary>
  );
}

export default AppRoot;
