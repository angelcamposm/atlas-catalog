import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface UnderConstructionProps {
    icon?: React.ElementType;
    title: string;
    description?: string;
    estimatedCompletion?: string;
}

export function UnderConstruction({
    icon: Icon = Construction,
    title,
    description = "Esta sección está actualmente en desarrollo y estará disponible próximamente.",
    estimatedCompletion,
}: UnderConstructionProps) {
    return (
        <div className="container mx-auto flex min-h-[600px] items-center justify-center p-6">
            <Card className="max-w-2xl w-full">
                <CardContent className="pt-12 pb-12 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="relative">
                            <Icon className="h-24 w-24 text-yellow-500 dark:text-yellow-400 animate-pulse" />
                            <div className="absolute -bottom-2 -right-2">
                                <Construction className="h-10 w-10 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                        {title}
                    </h2>

                    <p className="mb-6 text-lg text-muted-foreground max-w-md mx-auto">
                        {description}
                    </p>

                    {estimatedCompletion && (
                        <div className="inline-flex items-center gap-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 text-sm font-medium text-yellow-800 dark:text-yellow-400">
                            <Construction className="h-4 w-4" />
                            <span>Estimado: {estimatedCompletion}</span>
                        </div>
                    )}

                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                        <p className="text-sm text-muted-foreground">
                            Mientras tanto, puedes explorar otras secciones
                            disponibles en el menú lateral.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
