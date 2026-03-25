interface TrustedBrandsSectionProps {
    title: string;
    items: string[];
}

export function TrustedBrandsSection({
    title,
    items,
}: TrustedBrandsSectionProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <section className="bg-gray-50 py-12 dark:bg-gray-950">
            <div className="container mx-auto px-4">
                <p className="text-center text-xs font-semibold uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
                    {title}
                </p>
                <div className="mt-8 grid grid-cols-2 gap-6 text-center text-sm font-semibold text-gray-600 dark:text-gray-300 sm:grid-cols-3 md:grid-cols-6">
                    {items.map((item) => (
                        <div
                            key={item}
                            className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
