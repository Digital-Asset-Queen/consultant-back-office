import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/LanguageContext";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { useAuthContext } from "./index";

export function LoginScreen() {
  const { login, isInitializing } = useAuthContext();
  const t = useT();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "oklch(var(--background))" }}
    >
      {/* Language switcher — top corner */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-foreground/5 border border-border mb-6">
            <Lock className="w-6 h-6 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-3xl text-foreground mb-2">
            {t("login.title")}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("login.subtitle")}
          </p>
        </div>

        <div
          className="rounded-lg border border-border p-8 space-y-6"
          style={{ background: "oklch(var(--card))" }}
        >
          <div className="space-y-1">
            <h2 className="font-serif text-lg text-foreground">
              {t("login.signInToContinue")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("login.yourDataPrivate")}
            </p>
          </div>

          {isInitializing ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t("login.checkingSession")}</span>
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                onClick={async () => {
                  setIsLoggingIn(true);
                  setLoginError(null);
                  try {
                    await login();
                  } catch {
                    setLoginError(t("login.signInFailed"));
                  } finally {
                    setIsLoggingIn(false);
                  }
                }}
                disabled={isLoggingIn}
                className="w-full"
                data-ocid="login.primary_button"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {t("login.signingIn")}
                  </>
                ) : (
                  t("login.signInWithII")
                )}
              </Button>
              {loginError && (
                <p className="text-sm text-destructive mt-2 text-center">
                  {loginError}
                </p>
              )}
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            {t("login.noPassword")}
          </p>
        </div>
      </div>
    </div>
  );
}
