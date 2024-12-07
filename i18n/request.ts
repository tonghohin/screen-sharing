import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

const LOCALES = ["en", "zh"];

export default getRequestConfig(async () => {
    // Provide a static locale, fetch a user setting,
    // read locale from `cookies()`, `headers()`, etc.
    // const locale = LOCALES.includes(navigator.language) ? navigator.language : "en";
    // const locale = (await cookies()).get('locale')?.value || "en";
    const locale =
        (await headers())
            .get("accept-language")
            ?.split(",")
            .map((l) => l.replace(/;q=[\.\d]+/, ""))
            .find((lang) => LOCALES.includes(lang)) || "en";

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default
    };
});
