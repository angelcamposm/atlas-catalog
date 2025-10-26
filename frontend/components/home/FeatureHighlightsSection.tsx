import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface FeatureItem {
    label: string;
    title: string;
    description: string;
}

interface FeatureHighlightsSectionProps {
    title: string;
    subtitle: string;
    items: FeatureItem[];
}

export function FeatureHighlightsSection({
    title,
    subtitle,
    items,
}: FeatureHighlightsSectionProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <section id="features" className="py-20">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <Badge
                        variant="secondary"
                        className="uppercase tracking-widest"
                    >
                        {title}
                    </Badge>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                        {subtitle}
                    </p>
                </div>
                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {items.map((item) => (
                        <Card
                            key={item.title}
                            className="border border-gray-200/60 shadow-sm dark:border-gray-800/80"
                        >
                            <CardHeader className="space-y-1">
                                <Badge
                                    variant="primary"
                                    className="uppercase tracking-wide"
                                >
                                    {item.label}
                                </Badge>
                                <CardTitle>{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {item.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
