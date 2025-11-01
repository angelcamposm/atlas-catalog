import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { type Locale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
    // Obtener el locale del request
    const requestedLocale = await requestLocale;

    // Validar que el locale es uno de los soportados, si no usar el default
    const locale =
        requestedLocale && routing.locales.includes(requestedLocale as Locale)
            ? requestedLocale
            : routing.defaultLocale;

    // Cargar mensajes del locale correspondiente
    const messages = await import(`../messages/${locale}.json`).then(
        (module) => module.default
    );

    return {
        locale,
        messages,
    };
});
