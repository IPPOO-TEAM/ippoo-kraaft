import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { Button } from "./ui/button";
import { AlertCircle, Home, RefreshCcw } from "lucide-react";

export function RouteErrorBoundary() {
  const error = useRouteError();

  let title = "Une erreur est survenue";
  let message = "Impossible de charger cette page.";
  let details = "";

  if (isRouteErrorResponse(error)) {
    title = `Erreur ${error.status}`;
    message = error.statusText || message;
    if (error.status === 404) {
      title = "Page introuvable";
      message = "La page que vous recherchez n'existe pas.";
    }
  } else if (error instanceof Error) {
    message = error.message;
    details = error.stack || "";

    // Handle dynamic import errors
    if (error.message.includes("Failed to fetch dynamically imported module")) {
      title = "Erreur de chargement";
      message = "Impossible de charger ce module. Veuillez rafraîchir la page.";
    }
  }

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-muted-foreground">{message}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleRefresh} variant="default">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Rafraîchir
          </Button>
          <Button asChild variant="outline">
            <Link to="/accueil">
              <Home className="w-4 h-4 mr-2" />
              Accueil
            </Link>
          </Button>
        </div>

        {details && import.meta.env.DEV && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              Détails techniques
            </summary>
            <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto max-h-48">
              {details}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
