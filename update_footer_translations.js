const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));

const footerAdditions = {
    en: {
        "regulatory": "LASS Realty is a registered real estate brokerage in the Dominican Republic (Registration No. R-789-V2). Member of the National Association of Real Estate Professionals (License No. 442-991A).",
        "disclaimer": "All information provided is deemed reliable but is not guaranteed and should be independently verified. Properties are subject to prior sale, change, or withdrawal. Neither listing broker(s) nor LASS Realty shall be responsible for any typographical errors, misinformation, or misprints.",
        "developedBy": "Website engineered by"
    },
    es: {
        "regulatory": "LASS Realty es una agencia inmobiliaria registrada en la República Dominicana (Registro No. R-789-V2). Miembro de la Asociación Nacional de Profesionales Inmobiliarios (Licencia No. 442-991A).",
        "disclaimer": "Toda la información proporcionada se considera confiable, pero no está garantizada y debe verificarse de manera independiente. Las propiedades están sujetas a venta previa, cambio o retiro. Ni los corredores ni LASS Realty serán responsables de errores tipográficos u omisiones.",
        "developedBy": "Sitio web desarrollado por"
    },
    fr: {
        "regulatory": "LASS Realty est une agence immobilière enregistrée en République Dominicaine (N° d'enregistrement R-789-V2).",
        "disclaimer": "Les informations fournies sont jugées fiables mais ne sont pas garanties.",
        "developedBy": "Site web développé par"
    },
    it: {
        "regulatory": "LASS Realty è un'agenzia immobiliare registrata nella Repubblica Dominicana (Registrazione N. R-789-V2).",
        "disclaimer": "Tutte le informazioni fornite sono ritenute affidabili ma non sono garantite e devono essere verificate indipendentemente.",
        "developedBy": "Sito web sviluppato da"
    },
    de: {
        "regulatory": "LASS Realty ist eine in der Dominikanischen Republik registrierte Immobilienmakleragentur (Registrierungsnr. R-789-V2).",
        "disclaimer": "Alle angegebenen Informationen gelten als zuverlässig, sind jedoch nicht garantiert und sollten unabhängig überprüft werden.",
        "developedBy": "Website entwickelt von"
    },
    ht: {
        "regulatory": "LASS Realty se yon ajans imobilye ki anrejistre nan Repiblik Dominikèn (Enskripsyon No. R-789-V2).",
        "disclaimer": "Tout enfòmasyon yo bay yo konsidere kòm serye men yo pa garanti.",
        "developedBy": "Sit entènèt devlope pa"
    },
    ru: {
        "regulatory": "LASS Realty — зарегистрированное агентство недвижимости в Доминиканской Республике (регистрационный номер R-789-V2).",
        "disclaimer": "Вся предоставленная информация считается надежной, но не гарантируется и должна быть проверена независимо.",
        "developedBy": "Сайт разработан"
    }
};

let updatedCount = 0;

for (const file of files) {
    const langaugeCode = file.replace('.json', '');
    const filePath = path.join(messagesDir, file);

    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Ensure Footer exists
        if (!data.Footer) {
            data.Footer = {};
        }

        // Add missing keys
        const langAdditions = footerAdditions[langaugeCode] || footerAdditions.en;

        let modified = false;
        for (const [key, value] of Object.entries(langAdditions)) {
            if (!data.Footer[key]) {
                data.Footer[key] = value;
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
            console.log(`Updated ${file} with new Footer translation keys.`);
            updatedCount++;
        }
    } catch (err) {
        console.error(`Error processing ${file}:`, err);
    }
}

console.log(`Finished updating ${updatedCount} files.`);
