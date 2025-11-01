import { getTranslations } from "next-intl/server";
import { type Locale } from "@/i18n/config";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/Button";

interface LoginPageProps {
    params: Promise<{
        locale: Locale;
    }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
    const { locale } = await params;
    const common = await getTranslations({ locale, namespace: "common" });

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        {common("login")}
                    </CardTitle>
                    <CardDescription>
                        Autenticación próximamente disponible
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Esta funcionalidad estará disponible en una próxima
                        versión. Por ahora, puedes explorar el catálogo
                        libremente.
                    </p>
                    <Button asChild className="w-full">
                        <a href={`/${locale}`}>Volver al inicio</a>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
