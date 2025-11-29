import { notFound, redirect } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

interface HomePageProps {
    params: Promise<{
        locale: Locale;
    }>;
}

export default async function HomePage({ params }: HomePageProps) {
    const { locale } = await params;

    if (!locales.includes(locale)) {
        notFound();
    }

    redirect(`/${locale}/dashboard`);
}
