/**
 * Maps the app's locale codes to proper Intl date locale codes.
 * This ensures dates are formatted correctly in all 7 supported languages.
 */
export function getDateLocale(locale: string): string {
    const localeMap: Record<string, string> = {
        en: 'en-US',
        es: 'es-DO',
        fr: 'fr-FR',
        it: 'it-IT',
        de: 'de-DE',
        ru: 'ru-RU',
        ht: 'ht-HT',
    };
    return localeMap[locale] || 'en-US';
}
