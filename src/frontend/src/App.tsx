import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider, useAuthContext } from "@/components/auth";
import { LoginScreen } from "@/components/auth/LoginScreen";
import { AppLayout } from "@/components/layout/AppLayout";
import { Toaster } from "@/components/ui/sonner";
import { useT } from "@/i18n/LanguageContext";
import { AdminModule } from "@/pages/AdminModule";
import BizDevModule from "@/pages/BizDevModule";
import DashboardModule from "@/pages/Dashboard/DashboardModule";
import FinanceModule from "@/pages/FinanceModule";
import { LandingPage } from "@/pages/LandingPage";
import WorkModule from "@/pages/WorkModule";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useState } from "react";

// Backwards-compatible no-op hook — pages still import this
export function usePageTitle(_title: string): void {
  // Page titles now live inside each page's content area
}

// Root layout component with auth guard
function RootLayout() {
  const { isAuthenticated, isInitializing, actorError } = useAuthContext();
  const [showLogin, setShowLogin] = useState(false);
  const t = useT();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">{t("app.loading")}</p>
        </div>
      </div>
    );
  }

  if (actorError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-lg font-semibold text-foreground">
            {t("app.connectionError")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("app.couldNotConnect")}
          </p>
          <p className="text-xs font-mono text-destructive break-words">
            {actorError}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
            data-ocid="actor_error.reload_button"
          >
            {t("app.reload")}
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showLogin) {
      return <LoginScreen />;
    }
    return <LandingPage onLogin={() => setShowLogin(true)} />;
  }

  return (
    <AppLayout>
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </AppLayout>
  );
}

// Route definitions
const rootRoute = createRootRoute({
  component: () => (
    <AuthProvider>
      <RootLayout />
      <Toaster />
    </AuthProvider>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardModule,
});

const workRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/work",
  component: WorkModule,
});

const bizdevRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/bizdev",
  component: BizDevModule,
});

const financeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/finance",
  component: FinanceModule,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminModule,
});

// Legacy routes kept for backwards compatibility (not linked from nav)
const legacyRoutes = [
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/clients",
    component: WorkModule,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/engagements",
    component: WorkModule,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/time-expenses",
    component: WorkModule,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/pipeline",
    component: BizDevModule,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/proposals",
    component: BizDevModule,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/invoicing",
    component: FinanceModule,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/contracts",
    component: FinanceModule,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/documents",
    component: AdminModule,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/communications",
    component: AdminModule,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/contacts",
    component: AdminModule,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/settings",
    component: AdminModule,
  }),
];

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  workRoute,
  bizdevRoute,
  financeRoute,
  adminRoute,
  ...legacyRoutes,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
