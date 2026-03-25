import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface CallToActionSectionProps {
    title: string;
    description: string;
    primaryCta: {
        label: string;
        href: string;
    };
    secondaryCta: {
        label: string;
        href: string;
    };
    backendLabel: string;
    backendValue: string;
    featuresLabel: string;
    featuresValue: string;
    techStackLabel: string;
    techStackValue: string;
    footnote: string;
}

export function CallToActionSection({
    title,
    description,
    primaryCta,
    secondaryCta,
    backendLabel,
    backendValue,
    featuresLabel,
    featuresValue,
    techStackLabel,
    techStackValue,
    footnote,
}: CallToActionSectionProps) {
    return (
        <section
            id="quickstart"
            className="relative overflow-hidden bg-gradient-cta py-24 text-white"
        >
            <div className="absolute inset-0 -z-10 opacity-30 bg-white/10 blur-3xl" />
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-semibold sm:text-4xl">
                        {title}
                    </h2>
                    <p className="mt-4 text-lg text-blue-100">{description}</p>
                </div>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link href={primaryCta.href}>
                        <Button
                            size="lg"
                            className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-100"
                        >
                            {primaryCta.label}
                        </Button>
                    </Link>
                    <Link href={secondaryCta.href}>
                        <Button
                            size="lg"
                            variant="ghost"
                            className="w-full border border-white/30 text-white hover:bg-white/10 sm:w-auto"
                        >
                            {secondaryCta.label}
                        </Button>
                    </Link>
                </div>
                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-6 text-left shadow-lg backdrop-blur">
                        <p className="text-sm font-medium uppercase tracking-wide text-white/70">
                            {backendLabel}
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">
                            {backendValue}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-6 text-left shadow-lg backdrop-blur">
                        <p className="text-sm font-medium uppercase tracking-wide text-white/70">
                            {featuresLabel}
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">
                            {featuresValue}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-6 text-left shadow-lg backdrop-blur">
                        <p className="text-sm font-medium uppercase tracking-wide text-white/70">
                            {techStackLabel}
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">
                            {techStackValue}
                        </p>
                    </div>
                </div>
                <p className="mt-16 text-center text-sm text-white/70">
                    {footnote}
                </p>
            </div>
        </section>
    );
}
