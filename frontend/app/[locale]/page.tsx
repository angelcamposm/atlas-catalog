import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { type Locale } from "@/i18n/config";

interface HomePageProps {
    params: {
        locale: Locale;
    };
}

export default async function HomePage({ params }: HomePageProps) {
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: "home" });
    const common = await getTranslations({ locale, namespace: "common" });

    const basePath = `/${locale}`;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        {t("title")}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        {t("subtitle")}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("cards.catalog.title")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {t("cards.catalog.description")}
                            </p>
                            <Link href={`${basePath}/apis`}>
                                <Button variant="primary" className="w-full">
                                    {common("viewApis")}
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t("cards.types.title")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {t("cards.types.description")}
                            </p>
                            <Link href={`${basePath}/api-types`}>
                                <Button variant="secondary" className="w-full">
                                    {common("manageTypes")}
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t("cards.lifecycles.title")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {t("cards.lifecycles.description")}
                            </p>
                            <Link href={`${basePath}/lifecycles`}>
                                <Button variant="secondary" className="w-full">
                                    {common("viewLifecycles")}
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t("cards.languages.title")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {t("cards.languages.description")}
                            </p>
                            <Link href={`${basePath}/programming-languages`}>
                                <Button variant="secondary" className="w-full">
                                    {common("viewLanguages")}
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t("cards.domains.title")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {t("cards.domains.description")}
                            </p>
                            <Button variant="ghost" className="w-full" disabled>
                                {common("comingSoon")}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t("cards.discovery.title")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {t("cards.discovery.description")}
                            </p>
                            <Button variant="ghost" className="w-full" disabled>
                                {common("comingSoon")}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardHeader>
                        <CardTitle className="text-blue-900 dark:text-blue-100">
                            {t("quickStart.title")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <p className="text-blue-800 dark:text-blue-200">
                                <strong>{common("backendLabel")}</strong>{" "}
                                <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-sm">
                                    {process.env.NEXT_PUBLIC_API_URL ||
                                        "http://localhost:8000/api"}
                                </code>
                            </p>
                            <p className="text-blue-800 dark:text-blue-200">
                                <strong>{common("featuresLabel")}</strong>{" "}
                                {t("quickStart.features")}
                            </p>
                            <p className="text-blue-800 dark:text-blue-200">
                                <strong>{common("techStackLabel")}</strong>{" "}
                                {common("techStackValue")}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center mt-16 text-gray-600 dark:text-gray-400">
                    <p>{common("builtWith", { heart: "❤" })}</p>
                </div>
            </main>
        </div>
    );
}
