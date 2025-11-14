"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function RouteProgressBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isAnimating, setIsAnimating] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Start animation on route change
        setIsAnimating(true);
        setProgress(20);

        const step1 = setTimeout(() => setProgress(60), 200);
        const step2 = setTimeout(() => setProgress(85), 600);

        return () => {
            clearTimeout(step1);
            clearTimeout(step2);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, searchParams?.toString()]);

    useEffect(() => {
        if (!isAnimating) return;

        const finish = setTimeout(() => {
            setProgress(100);

            const hide = setTimeout(() => {
                setIsAnimating(false);
                setProgress(0);
            }, 200);

            return () => clearTimeout(hide);
        }, 800);

        return () => clearTimeout(finish);
    }, [isAnimating]);

    if (!isAnimating) return null;

    return (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent">
            <div
                className="h-full w-full origin-left bg-primary transition-[transform,opacity] duration-200 ease-out"
                style={{ transform: `scaleX(${progress / 100})` }}
            />
        </div>
    );
}
