import { useLanguage } from "@/i18n/LanguageContext";
import type { Language } from "@/i18n/translations";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  /** Visual variant for placement on light vs. dark backgrounds. */
  variant?: "default" | "onDark";
  className?: string;
}

/**
 * Compact TH | EN pill toggle. The active language is highlighted with the
 * accent color. Used in the app header and on landing/login screens.
 */
export function LanguageSwitcher({
  variant = "default",
  className,
}: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();

  const options: Array<{ code: Language; label: string; ariaKey: string }> = [
    {
      code: "th",
      label: t("language.switcher.th"),
      ariaKey: "language.switcher.ariaTH",
    },
    {
      code: "en",
      label: t("language.switcher.en"),
      ariaKey: "language.switcher.ariaEN",
    },
  ];

  const containerBase =
    variant === "onDark"
      ? "border-sidebar-foreground/20 bg-sidebar-foreground/5"
      : "border-border bg-muted/40";
  const inactiveBase =
    variant === "onDark"
      ? "text-sidebar-foreground/55 hover:text-sidebar-foreground hover:bg-sidebar-foreground/10"
      : "text-muted-foreground hover:text-foreground hover:bg-muted";
  const activeBase =
    variant === "onDark"
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "bg-accent text-accent-foreground";

  return (
    <fieldset
      aria-label={t("language.switcher.aria")}
      className={cn(
        "inline-flex items-center rounded-full border p-0.5",
        containerBase,
        className,
      )}
      data-ocid="language_switcher.group"
    >
      {options.map((opt) => {
        const isActive = language === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => setLanguage(opt.code)}
            aria-label={t(opt.ariaKey)}
            aria-pressed={isActive}
            data-ocid={`language_switcher.${opt.code}.button`}
            className={cn(
              "px-2.5 py-1 text-xs font-medium rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              isActive ? activeBase : inactiveBase,
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </fieldset>
  );
}

export default LanguageSwitcher;
