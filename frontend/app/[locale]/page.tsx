import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustedBrandsSection } from "@/components/home/TrustedBrandsSection";
import { FeatureHighlightsSection } from "@/components/home/FeatureHighlightsSection";
import { QuickLinksSection } from "@/components/home/QuickLinksSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CallToActionSection } from "@/components/home/CallToActionSection";
import { type Locale } from "@/i18n/config";

interface HomePageProps {
    params: {
        locale: Locale;
    };
}

export default async function HomePage({ params }: HomePageProps) {
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: "home" });
    const common = await getTranslations({ locale, namespace: "common" });

    const basePath = `/${locale}`;

    const heroStats = [
        {
            value: t("hero.stats.catalog.value"),
            label: t("hero.stats.catalog.label"),
            description: t("hero.stats.catalog.description"),
        },
        {
            value: t("hero.stats.teams.value"),
            label: t("hero.stats.teams.label"),
            description: t("hero.stats.teams.description"),
        },
        {
            value: t("hero.stats.uptime.value"),
            label: t("hero.stats.uptime.label"),
            description: t("hero.stats.uptime.description"),
        },
    ];

    const brandItems = (t.raw("brands.items") as string[]) ?? [];

    const featureKeys = ["inventory", "governance", "insights"] as const;
    const featureItems = featureKeys.map((key) => ({
        label: t(`featureHighlights.items.${key}.label`),
        title: t(`featureHighlights.items.${key}.title`),
        description: t(`featureHighlights.items.${key}.description`),
    }));

    const quickLinkConfig = [
        {
            key: "catalog",
            href: `${basePath}/apis`,
            actionLabel: common("viewApis"),
            variant: "primary" as const,
            disabled: false,
        },
        {
            key: "types",
            href: `${basePath}/api-types`,
            actionLabel: common("manageTypes"),
            variant: "secondary" as const,
            disabled: false,
        },
        {
            key: "lifecycles",
            href: `${basePath}/lifecycles`,
            actionLabel: common("viewLifecycles"),
            variant: "secondary" as const,
            disabled: false,
        },
        {
            key: "languages",
            href: `${basePath}/programming-languages`,
            actionLabel: common("viewLanguages"),
            variant: "secondary" as const,
            disabled: false,
        },
        {
            key: "domains",
            href: "#",
            actionLabel: common("comingSoon"),
            variant: "ghost" as const,
            disabled: true,
        },
        {
            key: "discovery",
            href: "#",
            actionLabel: common("comingSoon"),
            variant: "ghost" as const,
            disabled: true,
        },
    ];

    const quickLinks = quickLinkConfig.map((item) => ({
        title: t(`cards.${item.key}.title`),
        description: t(`cards.${item.key}.description`),
        actionLabel: item.actionLabel,
        href: item.href,
        variant: item.variant,
        disabled: item.disabled,
    }));

    const stepKeys = ["import", "enrich", "publish"] as const;
    const steps = stepKeys.map((key, index) => ({
        index: index + 1,
        title: t(`howItWorks.steps.${key}.title`),
        description: t(`howItWorks.steps.${key}.description`),
    }));

    const testimonialKeys = ["sofia", "liam"] as const;
    const testimonials = testimonialKeys.map((key) => ({
        quote: t(`testimonials.items.${key}.quote`),
        author: t(`testimonials.items.${key}.author`),
        role: t(`testimonials.items.${key}.role`),
    }));

    const backendUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    return (
        <div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
            <HeroSection
                badge={t("hero.badge")}
                titleHighlight={t("hero.title.highlight")}
                titleAccent={t("hero.title.accent")}
                description={t("hero.description")}
                primaryCta={{
                    label: t("hero.ctaPrimary"),
                    href: `${basePath}/apis`,
                }}
                secondaryCta={{
                    label: t("hero.ctaSecondary"),
                    href: "#how-it-works",
                }}
                stats={heroStats}
            />
            <TrustedBrandsSection
                title={t("brands.title")}
                items={brandItems}
            />
            <FeatureHighlightsSection
                title={t("featureHighlights.title")}
                subtitle={t("featureHighlights.subtitle")}
                items={featureItems}
            />
            <QuickLinksSection
                title={t("quickLinks.title")}
                subtitle={t("quickLinks.subtitle")}
                items={quickLinks}
            />
            <HowItWorksSection
                title={t("howItWorks.title")}
                subtitle={t("howItWorks.subtitle")}
                steps={steps}
            />
            <TestimonialsSection
                title={t("testimonials.title")}
                subtitle={t("testimonials.subtitle")}
                items={testimonials}
            />
            <CallToActionSection
                title={t("quickStart.title")}
                description={t("quickStart.description")}
                primaryCta={{
                    label: t("quickStart.primaryCta"),
                    href: `${basePath}/apis`,
                }}
                secondaryCta={{
                    label: t("quickStart.secondaryCta"),
                    href: "#modules",
                }}
                backendLabel={common("backendLabel")}
                backendValue={backendUrl}
                featuresLabel={common("featuresLabel")}
                featuresValue={t("quickStart.features")}
                techStackLabel={common("techStackLabel")}
                techStackValue={common("techStackValue")}
                footnote={common("builtWith", { heart: "❤" })}
            />
        </div>
    );
}
