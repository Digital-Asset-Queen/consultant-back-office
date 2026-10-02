import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useT } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Briefcase,
  DollarSign,
  LayoutDashboard,
  Menu,
  Settings,
  TrendingUp,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

// CRITICAL: navItems stores icon as ComponentType.
// In JSX, always assign to a local capitalized variable before rendering.
// e.g. const NavIcon = item.icon; return <NavIcon />
// NEVER do: {item.icon} or <item.icon />
const navItems: Array<{
  path: string;
  labelKey: string;
  icon: React.ElementType;
  exact: boolean;
}> = [
  { path: "/", labelKey: "nav.dashboard", icon: LayoutDashboard, exact: true },
  { path: "/work", labelKey: "nav.work", icon: Briefcase, exact: false },
  { path: "/bizdev", labelKey: "nav.bizdev", icon: TrendingUp, exact: false },
  { path: "/finance", labelKey: "nav.finance", icon: DollarSign, exact: false },
  { path: "/admin", labelKey: "nav.admin", icon: Settings, exact: false },
];

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const t = useT();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsTablet(e.matches);
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-screen overflow-hidden">
        {/* ── SIDEBAR: fixed, full viewport height, dark bg ── */}
        <aside
          className={cn(
            "fixed top-0 bottom-0 left-0 z-20 hidden flex-col overflow-y-auto md:flex sidebar-bg",
            isTablet ? "w-sidebar-collapsed" : "w-sidebar",
          )}
        >
          {/* App name / logo + language switcher */}
          <div className="flex items-center justify-between gap-2 px-4 h-14 border-b border-sidebar-border/20">
            <span className="text-sm font-semibold text-sidebar-foreground tracking-tight">
              {t("nav.backOffice")}
            </span>
            <LanguageSwitcher variant="onDark" />
          </div>

          {/* Navigation */}
          <nav
            className="flex flex-col gap-0.5 px-2 pt-3 pb-4"
            aria-label={t("nav.mainAria")}
          >
            {navItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              const label = t(item.labelKey);
              const NavIcon = item.icon;
              const linkContent = (
                <Link
                  to={item.path}
                  data-ocid={`nav.${item.labelKey.split(".")[1]}.link`}
                  className={cn(
                    "flex items-center gap-3 rounded-lg text-sm transition-opacity duration-fast ease-standard cursor-pointer",
                    isTablet
                      ? "justify-center px-0 py-3 mx-0"
                      : "px-4 py-2.5 mx-2",
                    isActive
                      ? "bg-accent text-white font-semibold"
                      : "text-muted-foreground opacity-60 hover:opacity-100 hover:bg-white/5",
                  )}
                >
                  <NavIcon className="w-5 h-5 flex-shrink-0" />
                  {!isTablet && (
                    <span className="whitespace-nowrap leading-none">
                      {label}
                    </span>
                  )}
                </Link>
              );

              return (
                <div key={item.path}>
                  {isTablet ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right" className="text-xs">
                        {label}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    linkContent
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* ── Mobile nav backdrop ── */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss */}
        <div
          className={cn(
            "fixed inset-0 z-40 bg-black/40 transition-opacity duration-fast ease-standard md:hidden",
            mobileNavOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none",
          )}
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />

        {/* ── Mobile sidebar ── */}
        <aside
          className={cn(
            "fixed left-0 top-0 bottom-0 z-50 flex flex-col sidebar-bg transition-opacity duration-fast ease-standard md:hidden w-sidebar",
            mobileNavOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none",
          )}
        >
          <div className="flex items-center justify-between gap-2 px-4 h-14 border-b border-sidebar-border/20">
            <span className="text-sm font-semibold text-sidebar-foreground tracking-tight">
              {t("nav.backOffice")}
            </span>
            <LanguageSwitcher variant="onDark" />
          </div>
          <nav
            className="flex flex-col gap-0.5 px-2 pt-3 pb-4"
            aria-label={t("nav.mobileAria")}
          >
            {navItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);
              const MobileNavIcon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  data-ocid={`nav.${item.labelKey.split(".")[1]}.link`}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-2.5 mx-2 text-sm transition-opacity duration-fast ease-standard cursor-pointer",
                    isActive
                      ? "bg-accent text-white font-semibold"
                      : "text-muted-foreground opacity-60 hover:opacity-100 hover:bg-white/5",
                  )}
                >
                  <MobileNavIcon className="w-5 h-5 flex-shrink-0" />
                  <span className="whitespace-nowrap leading-none">
                    {t(item.labelKey)}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* ── MAIN CONTENT AREA ── */}
        <main
          className={cn(
            "flex-1 h-screen overflow-y-auto bg-background",
            isTablet ? "ml-sidebar-collapsed" : "ml-sidebar",
          )}
          data-ocid="main.content"
        >
          {/* Mobile nav toggle — minimal, inline */}
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border bg-card md:hidden">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                className="flex items-center justify-center w-8 h-8 rounded text-muted-foreground hover:text-foreground"
                onClick={() => setMobileNavOpen((v) => !v)}
                aria-label={
                  mobileNavOpen ? t("nav.closeNav") : t("nav.openNav")
                }
                data-ocid="nav.mobile_menu.button"
              >
                {mobileNavOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </button>
              <span className="text-sm font-semibold text-foreground tracking-tight truncate">
                {t("nav.consultantBackOffice")}
              </span>
            </div>
            <LanguageSwitcher />
          </div>
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
}

export default AppLayout;
