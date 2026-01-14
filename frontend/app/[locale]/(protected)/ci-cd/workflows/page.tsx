import type { Metadata } from "next";
import { Construction } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: `Workflows - Atlas Catalog`,
        description: "CI/CD Workflows management",
    };
}

export default async function WorkflowsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] p-8">
            <div className="max-w-2xl w-full text-center space-y-8">
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-blue-indigo opacity-20 blur-3xl rounded-full" />
                        <div className="relative bg-gradient-blue-indigo p-8 rounded-full shadow-2xl">
                            <Construction className="h-24 w-24 text-white" />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                        Workflows
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Coming Soon
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                        Define and manage your CI/CD workflows and pipelines.
                    </p>
                </div>
            </div>
        </div>
    );
}
