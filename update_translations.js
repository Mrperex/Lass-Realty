const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));

const additions = {
    en: {
        "sortBy": "Sort By",
        "newest": "Newest First",
        "priceAsc": "Price (Low to High)",
        "priceDesc": "Price (High to Low)",
        "popular": "Most Popular"
    },
    es: {
        "sortBy": "Ordenar Por",
        "newest": "Más Recientes",
        "priceAsc": "Precio (Menor a Mayor)",
        "priceDesc": "Precio (Mayor a Menor)",
        "popular": "Más Populares"
    },
    fr: {
        "sortBy": "Trier Par",
        "newest": "Plus Récents",
        "priceAsc": "Prix (Croissant)",
        "priceDesc": "Prix (Décroissant)",
        "popular": "Plus Populaires"
    },
    it: {
        "sortBy": "Ordina Per",
        "newest": "Più Recenti",
        "priceAsc": "Prezzo (Crescente)",
        "priceDesc": "Prezzo (Decrescente)",
        "popular": "I Più Popolari"
    },
    de: {
        "sortBy": "Sortieren Nach",
        "newest": "Neueste Zuerst",
        "priceAsc": "Preis (aufsteigend)",
        "priceDesc": "Preis (absteigend)",
        "popular": "Beliebteste"
    },
    ht: {
        "sortBy": "Klase Pa",
        "newest": "Pi Nouvo",
        "priceAsc": "Pri (Ba rive Wo)",
        "priceDesc": "Pri (Wo rive Ba)",
        "popular": "Ki pi Popilè"
    },
    ru: {
        "sortBy": "Сортировать По",
        "newest": "Сначала Новые",
        "priceAsc": "Цена (по возрастанию)",
        "priceDesc": "Цена (по убыванию)",
        "popular": "Самые Популярные"
    }
};

let updatedCount = 0;

for (const file of files) {
    const langaugeCode = file.replace('.json', '');
    const filePath = path.join(messagesDir, file);

    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Ensure SearchFilters exists
        if (!data.SearchFilters) {
            data.SearchFilters = {};
        }

        // Add missing keys
        const langAdditions = additions[langaugeCode] || additions.en;

        let modified = false;
        for (const [key, value] of Object.entries(langAdditions)) {
            if (!data.SearchFilters[key]) {
                data.SearchFilters[key] = value;
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
            console.log(`Updated ${file} with new translation keys.`);
            updatedCount++;
        }
    } catch (err) {
        console.error(`Error processing ${file}:`, err);
    }
}

console.log(`Finished updating ${updatedCount} files.`);
