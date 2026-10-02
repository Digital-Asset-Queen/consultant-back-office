import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export interface ModuleTab {
  key: string;
  label: string;
  icon?: React.ElementType;
  content: ReactNode;
}

interface ModuleLayoutProps {
  title: string;
  tabs: ModuleTab[];
  defaultTab?: string;
  storageKey?: string;
}

export function ModuleLayout({
  title,
  tabs,
  defaultTab,
  storageKey,
}: ModuleLayoutProps) {
  const [activeTab, setActiveTab] = useState<string>(() => {
    const saved = storageKey ? localStorage.getItem(`tab:${storageKey}`) : null;
    const firstKey = tabs[0]?.key ?? "";
    if (saved && tabs.some((t) => t.key === saved)) {
      return saved;
    }
    return defaultTab ?? firstKey;
  });

  // Tab memory: persist active tab to localStorage
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(`tab:${storageKey}`, activeTab);
    }
  }, [activeTab, storageKey]);

  const handleTabClick = (tabKey: string) => {
    if (tabKey === activeTab) return;
    setActiveTab(tabKey);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Page title */}
      <div className="pt-6 pb-0 px-page">
        <h1 className="font-semibold text-foreground text-token-2xl">
          {title}
        </h1>
      </div>

      {/* Tab strip */}
      <div className="flex items-center gap-1 border-b border-border h-tab-strip px-page">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabClick(tab.key)}
              data-ocid={`module.${storageKey || "default"}.${tab.key}.tab`}
              className={cn(
                "relative flex items-center gap-2 cursor-pointer border-none bg-transparent transition-opacity duration-fast ease-standard",
                "pb-px text-token-sm px-tab py-tab",
                isActive
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
              <span className="whitespace-nowrap">{tab.label}</span>
              {/* Active indicator: bottom underline with opacity transition */}
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full transition-opacity duration-fast ease-standard"
                style={{
                  opacity: isActive ? 1 : 0,
                }}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      {/* Tab content area — zero layout shift via visibility+opacity */}
      <div className="flex-1 relative overflow-y-auto">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <div
              key={tab.key}
              aria-hidden={!isActive}
              className={cn(
                "absolute inset-0 overflow-y-auto transition-opacity duration-fast ease-standard",
                isActive
                  ? "opacity-100 z-10 pointer-events-auto visible"
                  : "opacity-0 z-0 pointer-events-none invisible",
              )}
            >
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ModuleLayout;
