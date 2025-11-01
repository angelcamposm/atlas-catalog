import { Badge } from "@/components/ui/Badge";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

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
                        <Card key={item.title}>
                            <CardHeader>
                                <Badge variant="primary" className="w-fit">
                                    {item.label}
                                </Badge>
                                <CardTitle>{item.title}</CardTitle>
                                <CardDescription>
                                    {item.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
