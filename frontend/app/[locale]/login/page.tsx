import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "common" });

    return {
        title: `${t("login")} - Atlas Catalog`,
        description: "Sign in to Atlas Catalog",
    };
}

export default async function LoginPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
            <LoginForm locale={locale} />
        </div>
    );
}
