import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'es', 'fr', 'it', 'ru', 'de', 'ht'];

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    // Validate that the incoming `locale` parameter is valid
    if (!locale || !locales.includes(locale as any)) {
        locale = locales[0];
    }

    console.log("🔥 NEXT-INTL GET_REQUEST_CONFIG RESOLVED LOCALE:", locale);

    return {
        locale: locale as string,
        messages: (await import(`./messages/${locale}.json`)).default
    };
});
