import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { AlertTriangle } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

interface FallbackProps {
  error: Error | null;
  onReload: () => void;
}

// Static English fallback strings used when the LanguageProvider is not
// mounted yet (e.g. an error thrown before the provider renders).
const STATIC_TITLE = "Something went wrong";
const STATIC_BODY =
  "The app encountered an unexpected error. You can try reloading to recover.";
const STATIC_RELOAD = "Reload App";

/**
 * Inner fallback that always calls useLanguage at the top level. If the
 * LanguageProvider is not mounted (error thrown before the provider renders),
 * useLanguage throws synchronously — which is caught by ErrorBoundary itself
 * and re-rendered with the static fallback below.
 */
function LocalizedErrorFallback({ error, onReload }: FallbackProps) {
  const { t } = useLanguage();
  return (
    <ErrorFallbackShell
      title={t("errorBoundary.title")}
      body={t("errorBoundary.body")}
      reloadLabel={t("errorBoundary.reloadApp")}
      error={error}
      onReload={onReload}
    />
  );
}

/**
 * Pure presentational shell with no hooks — used both for the localized
 * version and as a static English fallback when the provider is unavailable.
 */
function ErrorFallbackShell({
  title,
  body,
  reloadLabel,
  error,
  onReload,
}: FallbackProps & { title: string; body: string; reloadLabel: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10 border border-destructive/20">
          <AlertTriangle className="w-7 h-7 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{body}</p>
        </div>
        {error && (
          <div className="rounded-lg border border-border bg-muted/30 p-4 text-left">
            <p className="text-xs font-mono text-destructive break-words">
              {error.message}
            </p>
          </div>
        )}
        <Button
          onClick={onReload}
          variant="default"
          data-ocid="error_boundary.reload_button"
        >
          {reloadLabel}
        </Button>
      </div>
    </div>
  );
}

/**
 * Static English fallback used when the LanguageProvider is not mounted yet
 * (e.g. an error thrown before the provider renders).
 */
function StaticErrorFallback({ error, onReload }: FallbackProps) {
  return (
    <ErrorFallbackShell
      title={STATIC_TITLE}
      body={STATIC_BODY}
      reloadLabel={STATIC_RELOAD}
      error={error}
      onReload={onReload}
    />
  );
}

function ErrorFallback(props: FallbackProps) {
  try {
    return <LocalizedErrorFallback {...props} />;
  } catch {
    return <StaticErrorFallback {...props} />;
  }
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback error={this.state.error} onReload={this.handleReload} />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
