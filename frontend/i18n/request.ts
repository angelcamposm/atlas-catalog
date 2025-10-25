import type { AbstractIntlMessages } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { type Locale } from "./config";

const messagesMap: Record<Locale, () => Promise<AbstractIntlMessages>> = {
    en: () => import("../messages/en.json").then((module) => module.default),
    es: () => import("../messages/es.json").then((module) => module.default),
};

export default getRequestConfig(async ({ locale }) => {
    const loader = messagesMap[locale as Locale];

    if (!loader) {
        throw new Error(`Unsupported locale: ${locale}`);
    }

    const messages = await loader();

    return {
        messages,
    };
});
