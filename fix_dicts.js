const fs = require('fs');

const path = './messages/es.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Shorten Footer in Spanish
data.Footer = {
    ...data.Footer,
    "quickLinks": "Enlaces Rápidos",
    "aboutUs": "Sobre Nosotros",
    "properties": "Propiedades",
    "buyingGuide": "Guía de Compra",
    "contact": "Contacto",
    "contactUs": "Contáctenos",
    "privacy": "Privacidad",
    "terms": "Términos",
    "title": "LASS Realty",
    "description": "Su destino principal para bienes raíces de lujo y propiedades exclusivas."
};

fs.writeFileSync(path, JSON.stringify(data, null, 4));

// Add missing Keys to all dicts
const locales = ['en', 'es', 'fr', 'it', 'de', 'ru', 'ht'];

locales.forEach(loc => {
    const p = `./messages/${loc}.json`;
    if (fs.existsSync(p)) {
        const d = JSON.parse(fs.readFileSync(p, 'utf8'));

        if (d.MarketReports) {
            d.MarketReports.trustBadges = d.MarketReports.trustBadges || "Trusted Data";
            // Make sure these match next-intl expectations
            d.MarketReports.title = d.MarketReports.pageTitle || "Market Reports";
            d.MarketReports.description = d.MarketReports.pageSubtitle || "Download our reports.";
        }

        fs.writeFileSync(p, JSON.stringify(d, null, 4));
    }
});

console.log('Fixed dictionaries.');
