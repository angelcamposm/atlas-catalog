import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface HeroStat {
    value: string;
    label: string;
    description: string;
}

interface HeroSectionProps {
    badge: string;
    titleHighlight: string;
    titleAccent: string;
    description: string;
    primaryCta: {
        label: string;
        href: string;
    };
    secondaryCta: {
        label: string;
        href: string;
    };
    stats: HeroStat[];
}

export function HeroSection({
    badge,
    titleHighlight,
    titleAccent,
    description,
    primaryCta,
    secondaryCta,
    stats,
}: HeroSectionProps) {
    return (
        <section
            id="hero"
            className="relative overflow-hidden bg-gradient-hero dark:from-gray-950 dark:via-gray-900 dark:to-gray-900"
        >
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.2),transparent_60%)]" />
                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3Ahttp%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%2393c5fd%22%20fill-opacity%3D%220.25%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%221%22%20height%3D%221%22%20rx%3D%220.5%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
            </div>
            <div className="container mx-auto px-4 py-24 md:py-32">
                <div className="mx-auto max-w-4xl text-center">
                    <Badge
                        className="mb-6 uppercase tracking-wide"
                        variant="primary"
                    >
                        {badge}
                    </Badge>
                    <h1 className="text-4xl font-bold leading-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                        {titleHighlight}{" "}
                        <span className="bg-gradient-text-blue-indigo-blue">
                            {titleAccent}
                        </span>
                    </h1>
                    <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
                        {description}
                    </p>
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link href={primaryCta.href}>
                            <Button size="lg" className="w-full sm:w-auto">
                                {primaryCta.label}
                            </Button>
                        </Link>
                        <Link href={secondaryCta.href}>
                            <Button
                                size="lg"
                                variant="secondary"
                                className="w-full sm:w-auto"
                            >
                                {secondaryCta.label}
                            </Button>
                        </Link>
                    </div>
                    {stats.length > 0 && (
                        <div className="mt-16 grid gap-6 sm:grid-cols-3">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-2xl border border-blue-100 bg-white/80 p-6 text-left shadow-sm backdrop-blur dark:border-blue-900/60 dark:bg-blue-900/10"
                                >
                                    <div className="text-3xl font-semibold text-blue-700 dark:text-blue-300">
                                        {stat.value}
                                    </div>
                                    <div className="mt-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                        {stat.label}
                                    </div>
                                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                                        {stat.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
