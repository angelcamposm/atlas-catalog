import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n/config";

export default function Home() {
    const headersList = headers();
    const locale = headersList.get("x-next-intl-locale") ?? defaultLocale;

    redirect(`/${locale}/dashboard`);
}
