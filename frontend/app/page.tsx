import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Atlas Catalog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Centralized API catalog management system for tracking and managing your microservices, APIs, and digital assets.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>API Catalog</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Browse and manage your complete API inventory with rich metadata and documentation.
              </p>
              <Link href="/apis">
                <Button variant="primary" className="w-full">
                  View APIs
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Types</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Categorize your APIs by type: REST, GraphQL, SOAP, and more.
              </p>
              <Link href="/api-types">
                <Button variant="secondary" className="w-full">
                  Manage Types
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lifecycles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Track API lifecycle stages from development to production.
              </p>
              <Link href="/lifecycles">
                <Button variant="secondary" className="w-full">
                  View Lifecycles
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Programming Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Organize APIs by the programming languages they use.
              </p>
              <Link href="/programming-languages">
                <Button variant="secondary" className="w-full">
                  View Languages
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Domains</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Group services by business domains for clear ownership.
              </p>
              <Button variant="ghost" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Discovery Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Track how APIs were discovered and registered in the catalog.
              </p>
              <Button variant="ghost" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-blue-800 dark:text-blue-200">
                <strong>Backend API:</strong> Running at{" "}
                <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-sm">
                  {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}
                </code>
              </p>
              <p className="text-blue-800 dark:text-blue-200">
                <strong>Features:</strong> Full CRUD operations for APIs, Types, Lifecycles, and more
              </p>
              <p className="text-blue-800 dark:text-blue-200">
                <strong>Tech Stack:</strong> Next.js 15 + TypeScript + Tailwind CSS
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-600 dark:text-gray-400">
          <p>
            Built with{" "}
            <span className="text-red-500">❤</span>{" "}
            using Laravel & Next.js
          </p>
        </div>
      </main>
    </div>
  );
}
