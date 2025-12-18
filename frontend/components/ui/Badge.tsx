interface BadgeProps {
    children: React.ReactNode;
    variant?:
        | "primary"
        | "secondary"
        | "success"
        | "warning"
        | "danger"
        | "outline";
    className?: string;
}

export function Badge({
    children,
    variant = "primary",
    className = "",
}: BadgeProps) {
    const variantClasses = {
        primary:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        secondary:
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        success:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        warning:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        outline:
            "bg-transparent border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
        >
            {children}
        </span>
    );
}
