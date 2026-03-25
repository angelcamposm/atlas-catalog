import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/Button";

interface QuickLinkItem {
    title: string;
    description: string;
    actionLabel: string;
    href: string;
    variant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link";
    disabled?: boolean;
}

interface QuickLinksSectionProps {
    title: string;
    subtitle: string;
    items: QuickLinkItem[];
}

export function QuickLinksSection({
    title,
    subtitle,
    items,
}: QuickLinksSectionProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <section className="bg-gray-50 py-20 dark:bg-gray-950" id="modules">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
                        {subtitle}
                    </p>
                </div>
                <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                        <Card key={item.title} className="flex flex-col">
                            <CardHeader className="flex-1">
                                <CardTitle>{item.title}</CardTitle>
                                <CardDescription>
                                    {item.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href={item.href}>
                                    <Button
                                        className="w-full"
                                        variant={item.variant ?? "secondary"}
                                        disabled={item.disabled}
                                    >
                                        {item.actionLabel}
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
