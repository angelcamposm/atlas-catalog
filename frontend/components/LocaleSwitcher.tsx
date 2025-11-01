"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

export function LocaleSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations("common");
    const [isPending, startTransition] = useTransition();

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = event.target.value as Locale;
        if (nextLocale === locale) {
            return;
        }

        startTransition(() => {
            // Construir la nueva ruta con el locale actualizado
            const segments = pathname.split("/").filter(Boolean);
            // Reemplazar el primer segmento (locale actual) con el nuevo
            segments[0] = nextLocale;
            const newPath = `/${segments.join("/")}`;
            router.push(newPath);
        });
    };

    return (
        <div className="relative">
            <label htmlFor="locale-switcher" className="sr-only">
                {t("language")}
            </label>
            <select
                id="locale-switcher"
                className="h-9 cursor-pointer appearance-none rounded-lg border border-gray-300/60 bg-white/80 px-3 pr-8 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm transition-all hover:border-blue-400 hover:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200/50 dark:border-gray-700/60 dark:bg-gray-800/80 dark:text-gray-100 dark:hover:border-blue-500 dark:hover:bg-gray-800"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                }}
                value={locale}
                disabled={isPending}
                onChange={handleChange}
            >
                {locales.map((item) => (
                    <option key={item} value={item}>
                        {t(`locale.${item}`)}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default LocaleSwitcher;
