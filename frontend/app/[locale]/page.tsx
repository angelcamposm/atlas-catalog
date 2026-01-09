import { redirect } from "next/navigation";
import { type Locale } from "@/i18n/config";

interface HomePageProps {
    params: Promise<{
        locale: Locale;
    }>;
}

export default async function HomePage({ params }: HomePageProps) {
    const { locale } = await params;
    redirect(`/${locale}/components`);
}
