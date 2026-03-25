interface StepItem {
    title: string;
    description: string;
    index: number;
}

interface HowItWorksSectionProps {
    title: string;
    subtitle: string;
    steps: StepItem[];
}

export function HowItWorksSection({
    title,
    subtitle,
    steps,
}: HowItWorksSectionProps) {
    if (steps.length === 0) {
        return null;
    }

    return (
        <section id="how-it-works" className="py-20">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
                        {subtitle}
                    </p>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-3">
                    {steps.map((step) => (
                        <div
                            key={step.index}
                            className="relative rounded-2xl border border-gray-200/60 bg-white p-8 shadow-sm dark:border-gray-800/80 dark:bg-gray-900"
                        >
                            <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white shadow-md">
                                {String(step.index).padStart(2, "0")}
                            </div>
                            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                                {step.title}
                            </h3>
                            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
