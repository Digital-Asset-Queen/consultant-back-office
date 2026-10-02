import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useT } from "@/i18n/LanguageContext";
import { Briefcase, Layers, Lock } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

interface LandingPageProps {
  onLogin: () => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  const t = useT();
  const reduced = useReducedMotion();

  const features = [
    {
      icon: Layers,
      number: "01",
      title: t("landing.feature1Title"),
      description: t("landing.feature1Body"),
    },
    {
      icon: Lock,
      number: "02",
      title: t("landing.feature2Title"),
      description: t("landing.feature2Body"),
    },
    {
      icon: Briefcase,
      number: "03",
      title: t("landing.feature3Title"),
      description: t("landing.feature3Body"),
    },
  ];

  return (
    <div className="h-screen overflow-y-scroll scroll-snap-y">
      {/* Language switcher — fixed top corner, visible across all sections */}
      <div className="fixed top-4 right-4 z-30">
        <LanguageSwitcher />
      </div>

      {/* Section 1 — Hero */}
      <section className="snap-start min-h-screen relative w-full bg-background">
        {/* Responsive two-column (lg+) / stacked (below lg) hero layout */}
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduced ? { duration: 0 } : { duration: 0.15 }}
          className="flex flex-col lg:flex-row w-full min-h-screen"
        >
          {/* Copy column — left on lg+, top on mobile/tablet */}
          <div className="flex flex-col justify-center px-6 py-14 lg:py-0 relative z-10 lg:w-1/2 px-responsive">
            <p className="font-sans text-xs tracking-widest uppercase text-muted-foreground mb-8">
              {t("landing.eyebrow")}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-5xl xl:text-6xl leading-[1.08] tracking-tight text-foreground mb-7">
              {t("landing.heroLine1")}
              <br />
              {t("landing.heroLine2")}
              <br />
              <span className="italic text-muted-foreground">
                {t("landing.heroLine3")}
              </span>
            </h1>
            <p className="font-sans text-base text-muted-foreground leading-relaxed mb-10 max-w-[22rem]">
              {t("landing.heroSub")}
            </p>
            <Button
              size="lg"
              variant="cta"
              onClick={onLogin}
              className="w-fit"
              data-ocid="landing.primary_button"
            >
              {t("landing.cta")}
            </Button>
          </div>

          {/* Illustration column — contained below copy on mobile/tablet */}
          <div className="relative w-full h-64 md:h-80 lg:hidden overflow-hidden">
            <img
              src="/assets/generated/hero-consultant-workspace.dim_900x1080.png"
              alt={t("landing.altHero")}
              className="w-full h-full object-cover object-right"
            />
          </div>
          {/* Desktop: takes up right half as flex child, fills full height */}
          <div
            aria-hidden="true"
            className="hidden lg:flex lg:flex-1 overflow-hidden min-h-screen"
          >
            <img
              src="/assets/generated/hero-consultant-workspace.dim_900x1080.png"
              alt=""
              className="w-full h-full object-cover object-right min-h-screen"
            />
          </div>
        </motion.div>
      </section>

      {/* Section 2 — Features */}
      <section className="snap-start min-h-screen flex items-center bg-sidebar">
        <div className="w-full max-w-5xl mx-auto px-6 py-20 lg:px-12">
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduced ? { duration: 0 } : { duration: 0.15 }}
            className="mb-16"
          >
            <p className="font-sans text-xs tracking-widest uppercase mb-5 text-sidebar-foreground/50">
              {t("landing.whyItWorks")}
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl leading-tight max-w-xl text-sidebar-foreground">
              {t("landing.builtFor")}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-sidebar-accent overflow-hidden rounded-lg border border-sidebar-accent">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { duration: 0.15, delay: 0.1 + i * 0.08 }
                }
                className="flex flex-col gap-6 p-8 bg-sidebar"
                data-ocid={`landing.item.${i + 1}`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-serif text-4xl leading-none text-sidebar-foreground/25">
                    {feature.number}
                  </span>
                  {(() => {
                    const FeatureIcon = feature.icon;
                    return (
                      <FeatureIcon
                        className="w-5 h-5 mt-1 text-sidebar-foreground/45"
                        strokeWidth={1.5}
                      />
                    );
                  })()}
                </div>
                <div className="space-y-3 mt-auto">
                  <h3 className="font-serif text-xl leading-snug text-sidebar-foreground">
                    {feature.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-sidebar-foreground/45">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Final CTA */}
      <section className="snap-start min-h-screen flex items-center bg-sidebar">
        <div className="w-full max-w-2xl mx-auto px-6 py-16 lg:px-12 text-center">
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduced ? { duration: 0 } : { duration: 0.15 }}
            className="space-y-10"
          >
            {/* Eyebrow */}
            <p className="font-sans text-xs tracking-widest uppercase text-sidebar-foreground/35">
              {t("landing.finalEyebrow")}
            </p>

            <div className="space-y-6">
              <h2 className="font-serif text-4xl lg:text-5xl xl:text-5xl leading-[1.1] tracking-tight text-sidebar-foreground">
                {t("landing.finalHeadline")}
              </h2>
              <p className="font-sans text-base leading-relaxed mx-auto max-w-sm text-sidebar-foreground/45">
                {t("landing.finalBody")}
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button
                size="lg"
                variant="cta"
                onClick={onLogin}
                className="w-fit"
                data-ocid="landing.cta_button"
              >
                {t("landing.finalCta")}
              </Button>
              <p className="font-sans text-xs text-sidebar-foreground/30">
                {t("landing.finalNote")}
              </p>
            </div>

            {/* Rule + footer */}
            <div className="pt-8">
              <Separator className="mb-8 bg-sidebar-foreground/15" />
              <p className="font-sans text-xs text-sidebar-foreground/30">
                © {new Date().getFullYear()}. {t("landing.builtWith")}{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-sidebar-foreground/45"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
