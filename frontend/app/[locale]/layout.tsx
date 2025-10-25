import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import {
    getMessages,
    getTranslations,
    unstable_setRequestLocale,
} from "next-intl/server";
import type { ReactNode } from "react";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { locales, type Locale } from "@/i18n/config";

interface LocaleLayoutProps {
    children: ReactNode;
    params: {
        locale: Locale;
    };
}

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params,
}: {
    params: { locale: Locale };
}): Promise<Metadata> {
    const { locale } = params;

    if (!locales.includes(locale)) {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: "metadata" });

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function LocaleLayout({
    children,
    params,
}: LocaleLayoutProps) {
    const { locale } = params;

    if (!locales.includes(locale)) {
        notFound();
    }

    unstable_setRequestLocale(locale);
    const messages = await getMessages({ locale });

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <LocaleSwitcher />
            {children}
        </NextIntlClientProvider>
    );
}
