const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));

const amenitiesAdditions = {
    en: {
        "pool": "Private Pool",
        "oceanView": "Ocean View",
        "golfView": "Golf Course View",
        "furnished": "Fully Furnished",
        "petFriendly": "Pet Friendly",
        "gym": "Fitness Center / Gym",
        "spa": "Spa & Wellness",
        "tennisCourt": "Tennis Court",
        "security24h": "24/7 Security",
        "gatedCommunity": "Gated Community",
        "beachAccess": "Private Beach Access",
        "balcony": "Balcony",
        "terrace": "Terrace",
        "garden": "Private Garden",
        "parking": "Covered Parking",
        "elevator": "Elevator",
        "airConditioning": "Air Conditioning",
        "smartHome": "Smart Home System",
        "maidQuarters": "Maid Quarters",
        "wineCellar": "Wine Cellar",
        "homeTheater": "Home Theater",
        "helipad": "Helipad",
        "privateDock": "Private Marina Dock",
        "clubhouse": "Clubhouse Access",
        "kidsPlayground": "Kids Playground",
        "bbqArea": "BBQ Area",
        "solarPanels": "Solar Panels",
        "backupGenerator": "Backup Generator",
        "waterCistern": "Water Cistern",
        "concierge": "Concierge Service",
        "coworking": "Co-working Space"
    },
    es: {
        "pool": "Piscina Privada",
        "oceanView": "Vista al Mar",
        "golfView": "Vista al Campo de Golf",
        "furnished": "Completamente Amueblado",
        "petFriendly": "Mascotas Permitidas",
        "gym": "Gimnasio",
        "spa": "Spa y Bienestar",
        "tennisCourt": "Cancha de Tenis",
        "security24h": "Seguridad 24/7",
        "gatedCommunity": "Comunidad Cerrada",
        "beachAccess": "Acceso Privado a la Playa",
        "balcony": "Balcón",
        "terrace": "Terraza",
        "garden": "Jardín Privado",
        "parking": "Estacionamiento Techado",
        "elevator": "Ascensor",
        "airConditioning": "Aire Acondicionado",
        "smartHome": "Sistema de Casa Inteligente",
        "maidQuarters": "Cuarto de Servicio",
        "wineCellar": "Cava de Vinos",
        "homeTheater": "Cine en Casa",
        "helipad": "Helipuerto",
        "privateDock": "Muelle Privado",
        "clubhouse": "Acceso a Casa Club",
        "kidsPlayground": "Área de Juegos Infantiles",
        "bbqArea": "Área de BBQ",
        "solarPanels": "Paneles Solares",
        "backupGenerator": "Generador de Emergencia",
        "waterCistern": "Cisterna de Agua",
        "concierge": "Servicio de Conserjería",
        "coworking": "Espacio de Co-working"
    },
    fr: {
        "pool": "Piscine Privée",
        "oceanView": "Vue sur l'Océan",
        "golfView": "Vue sur le Golf",
        "furnished": "Entièrement Meublé",
        "petFriendly": "Animaux Acceptés",
        "gym": "Centre de Fitness",
        "spa": "Spa & Bien-être",
        "tennisCourt": "Court de Tennis",
        "security24h": "Sécurité 24/7",
        "gatedCommunity": "Communauté Fermée",
        "beachAccess": "Accès Privé à la Plage",
        "balcony": "Balcon",
        "terrace": "Terrasse",
        "garden": "Jardin Privé",
        "parking": "Parking Couvert",
        "elevator": "Ascenseur",
        "airConditioning": "Climatisation",
        "smartHome": "Maison Intelligente",
        "maidQuarters": "Chambre de Bonne",
        "wineCellar": "Cave à Vin",
        "homeTheater": "Cinéma Maison",
        "helipad": "Héliport",
        "privateDock": "Quai Privé",
        "clubhouse": "Accès au Club-house",
        "kidsPlayground": "Aire de Jeux",
        "bbqArea": "Espace Barbecue",
        "solarPanels": "Panneaux Solaires",
        "backupGenerator": "Générateur de Secours",
        "waterCistern": "Citerne d'Eau",
        "concierge": "Service de Conciergerie",
        "coworking": "Espace de Co-working"
    },
    it: {
        "pool": "Piscina Privata",
        "oceanView": "Vista Oceano",
        "golfView": "Vista Campo da Golf",
        "furnished": "Completamente Arredato",
        "petFriendly": "Animali Ammessi",
        "gym": "Centro Fitness / Palestra",
        "spa": "Spa & Benessere",
        "tennisCourt": "Campo da Tennis",
        "security24h": "Sicurezza 24/7",
        "gatedCommunity": "Comunità Recintata",
        "beachAccess": "Accesso Privato alla Spiaggia",
        "balcony": "Balcone",
        "terrace": "Terrazza",
        "garden": "Giardino Privato",
        "parking": "Parcheggio Coperto",
        "elevator": "Ascensore",
        "airConditioning": "Aria Condizionata",
        "smartHome": "Sistema Smart Home",
        "maidQuarters": "Alloggio per il Personale",
        "wineCellar": "Cantina",
        "homeTheater": "Home Theater",
        "helipad": "Eliporto",
        "privateDock": "Molo Privato",
        "clubhouse": "Accesso Clubhouse",
        "kidsPlayground": "Parco Giochi",
        "bbqArea": "Area BBQ",
        "solarPanels": "Pannelli Solari",
        "backupGenerator": "Generatore di Emergenza",
        "waterCistern": "Cisterna d'Acqua",
        "concierge": "Servizio Concierge",
        "coworking": "Spazio Co-working"
    },
    de: {
        "pool": "Privater Pool",
        "oceanView": "Meerblick",
        "golfView": "Golfplatzblick",
        "furnished": "Voll Möbliert",
        "petFriendly": "Haustiere Erlaubt",
        "gym": "Fitnesscenter",
        "spa": "Spa & Wellness",
        "tennisCourt": "Tennisplatz",
        "security24h": "24/7 Sicherheit",
        "gatedCommunity": "Gated Community",
        "beachAccess": "Privater Strandzugang",
        "balcony": "Balkon",
        "terrace": "Terrasse",
        "garden": "Privater Garten",
        "parking": "Überdachter Parkplatz",
        "elevator": "Aufzug",
        "airConditioning": "Klimaanlage",
        "smartHome": "Smart Home System",
        "maidQuarters": "Dienstmädchenzimmer",
        "wineCellar": "Weinkeller",
        "homeTheater": "Heimkino",
        "helipad": "Hubschrauberlandeplatz",
        "privateDock": "Privater Anlegesteg",
        "clubhouse": "Clubhaus-Zugang",
        "kidsPlayground": "Kinderspielplatz",
        "bbqArea": "BBQ-Bereich",
        "solarPanels": "Solarmodule",
        "backupGenerator": "Notstromaggregat",
        "waterCistern": "Wasserzisterne",
        "concierge": "Concierge-Service",
        "coworking": "Co-Working Space"
    },
    ht: {
        "pool": "Pisin Prive",
        "oceanView": "Vèy lanmè",
        "golfView": "Vèy kòlf",
        "furnished": "Konplètman Mèble",
        "petFriendly": "Bèt Aksepte",
        "gym": "Fòm / Jist",
        "spa": "Spa ak Byennèt",
        "tennisCourt": "Tribinal Tenis",
        "security24h": "Sekirite 24/7",
        "gatedCommunity": "Kominote Fèmen",
        "beachAccess": "Aksè Prive nan Plaj",
        "balcony": "Balkon",
        "terrace": "Teras",
        "garden": "Jaden Prive",
        "parking": "Pakin Kouvri",
        "elevator": "Asansè",
        "airConditioning": "Kondisyone Lè",
        "smartHome": "Sistèm Kay Entelijan",
        "maidQuarters": "Chanm Sèvant",
        "wineCellar": "Kav Diven",
        "homeTheater": "Sinema Kay",
        "helipad": "Epad Eli",
        "privateDock": "Prive Waf",
        "clubhouse": "Aksè nan Clubhouse",
        "kidsPlayground": "Lwazi Timoun",
        "bbqArea": "BBQ",
        "solarPanels": "Panèl Solè",
        "backupGenerator": "Aparèy Founi Kouraj",
        "waterCistern": "Sistèn Dlo",
        "concierge": "Sèvis Konsyèj",
        "coworking": "Espas Travay ansanm"
    },
    ru: {
        "pool": "Частный Бассейн",
        "oceanView": "Вид на Океан",
        "golfView": "Вид на Поле для Гольфа",
        "furnished": "Полностью Меблирована",
        "petFriendly": "Можно с Питомцами",
        "gym": "Фитнес-Центр",
        "spa": "Спа и Оздоровительный Центр",
        "tennisCourt": "Теннисный Корт",
        "security24h": "Круглосуточная Охрана",
        "gatedCommunity": "Закрытый Комплекс",
        "beachAccess": "Частный Доступ к Пляжу",
        "balcony": "Балкон",
        "terrace": "Терраса",
        "garden": "Частный Сад",
        "parking": "Крытая Парковка",
        "elevator": "Лифт",
        "airConditioning": "Кондиционер",
        "smartHome": "Умный Дом",
        "maidQuarters": "Комната для Персонала",
        "wineCellar": "Винный Погреб",
        "homeTheater": "Домашний Кинотеатр",
        "helipad": "Вертолетная Площадка",
        "privateDock": "Частный Причал",
        "clubhouse": "Доступ в Клубный Дом",
        "kidsPlayground": "Детская Площадка",
        "bbqArea": "Зона Барбекю",
        "solarPanels": "Солнечные Панели",
        "backupGenerator": "Резервный Генератор",
        "waterCistern": "Резервуар для Воды",
        "concierge": "Услуги Консьержа",
        "coworking": "Коворкинг"
    }
};

let updatedCount = 0;

for (const file of files) {
    const langaugeCode = file.replace('.json', '');
    const filePath = path.join(messagesDir, file);

    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Ensure Amenities exists
        if (!data.Amenities) {
            data.Amenities = {};
        }

        // Add missing keys
        const langAdditions = amenitiesAdditions[langaugeCode] || amenitiesAdditions.en;

        let modified = false;
        for (const [key, value] of Object.entries(langAdditions)) {
            if (!data.Amenities[key]) {
                data.Amenities[key] = value;
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
            console.log(`Updated ${file} with new Amenities translation keys.`);
            updatedCount++;
        }
    } catch (err) {
        console.error(`Error processing ${file}:`, err);
    }
}

console.log(`Finished updating ${updatedCount} files.`);
