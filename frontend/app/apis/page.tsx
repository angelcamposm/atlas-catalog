import { redirect } from "next/navigation";

/**
 * Legacy redirect for /apis → /es/apis.
 *
 * The `next-intl` middleware already handles locale redirects for most
 * routes, but this file exists as a fallback for direct navigation to
 * `/apis` without a locale prefix. Kept next-intl-free so it can be
 * pulled into Jest without triggering ESM parse errors.
 */
export default function LegacyApisPage() {
    redirect("/es/apis");
}
