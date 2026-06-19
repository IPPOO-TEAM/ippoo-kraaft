import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught:", error, info);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleHome = () => {
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div
        role="alert"
        aria-live="assertive"
        className="min-h-screen flex items-center justify-center px-4 bg-neutral-50"
      >
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-8 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-red-600" aria-hidden="true" />
          </div>
          <h1 className="mb-2">Une erreur est survenue</h1>
          <p className="text-neutral-600 mb-6">
            Désolé, quelque chose s'est mal passé. Vous pouvez réessayer ou revenir à l'accueil.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button onClick={this.handleReset} className="bg-[var(--ipk-green)] hover:bg-[var(--ipk-green-dark)]">
              <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
              Réessayer
            </Button>
            <Button onClick={this.handleHome} variant="outline">
              <Home className="w-4 h-4 mr-2" aria-hidden="true" />
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
