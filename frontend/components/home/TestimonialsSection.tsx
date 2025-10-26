interface TestimonialItem {
    quote: string;
    author: string;
    role: string;
}

interface TestimonialsSectionProps {
    title: string;
    subtitle: string;
    items: TestimonialItem[];
}

export function TestimonialsSection({
    title,
    subtitle,
    items,
}: TestimonialsSectionProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <section
            className="bg-gray-50 py-20 dark:bg-gray-950"
            id="testimonials"
        >
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
                        {subtitle}
                    </p>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-2">
                    {items.map((item) => (
                        <div
                            key={item.author}
                            className="h-full rounded-2xl border border-gray-200/60 bg-white p-8 text-left shadow-sm dark:border-gray-800/80 dark:bg-gray-900"
                        >
                            <p className="text-base text-gray-700 dark:text-gray-200">
                                &ldquo;{item.quote}&rdquo;
                            </p>
                            <div className="mt-6 text-sm font-semibold text-gray-900 dark:text-white">
                                {item.author}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {item.role}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
