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
        <div className="fixed top-4 right-4 z-50">
            <label htmlFor="locale-switcher" className="sr-only">
                {t("language")}
            </label>
            <select
                id="locale-switcher"
                className="rounded border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
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
