import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { defaultLocale } from "@/i18n/config";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

// Fuente para texto del cuerpo - Alta legibilidad
const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
});

// Fuente para títulos - Elegante y moderna
const plusJakarta = Plus_Jakarta_Sans({
    variable: "--font-display",
    subsets: ["latin"],
    display: "swap",
    weight: ["400", "500", "600", "700", "800"],
});

// Fuente monoespaciada para código
const jetbrainsMono = JetBrains_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Atlas Catalog",
    description: "Centralized API catalog management",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const headersList = await headers();
    const locale = headersList.get("x-next-intl-locale") ?? defaultLocale;

    return (
        <html lang={locale} suppressHydrationWarning>
            <body
                className={`${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} font-sans antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                    themes={[
                        "light",
                        "dark",
                        "blue",
                        "purple",
                        "green",
                        "orange",
                    ]}
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
