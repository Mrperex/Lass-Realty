import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

const propertySchema = new mongoose.Schema({
    title: String,
    title_es: String,
    slug: String,
    description: String,
    description_es: String,
    price: Number,
    city: String,
    city_es: String,
    citySlug: String,
    bedrooms: Number,
    bathrooms: Number,
    squareMeters: Number,
    status: String,
    featured: Boolean,
    images: [String],
    amenities: [String],
    type: String, // 'villa', 'condo', 'penthouse', 'land'
    pool: Boolean,
    oceanView: Boolean,
    golfView: Boolean,
    furnished: Boolean,
    petFriendly: Boolean
}, { strict: false, timestamps: true });

const Property = mongoose.model('PropertySeed', propertySchema, 'properties');

const CONDO_IMAGES = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687920-4e2a09be1587?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2670&auto=format&fit=crop'
];

const VILLA_IMAGES = [
    'https://images.unsplash.com/photo-1613490908578-15c13b28b615?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2675&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600566752355-38c4ca4d2e5a?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop'
];

const LAND_IMAGES = [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1629851722830-dfb6d6f2ef48?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1557008075-7f2c5efa4cb7?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1586500036706-41963de24d8b?q=80&w=2670&auto=format&fit=crop'
];

function getRandomImages(pool: string[], count: number) {
    return [...pool].sort(() => 0.5 - Math.random()).slice(0, count);
}

const propertiesData = [
    {
        title: "Luxury 2-Bed Condo in Atlántida – Pre-Construction Deal",
        title_es: "Lujoso Condo de 2 Habitaciones en Atlántida – Pre-Construcción",
        city: "Los Corales, Bávaro",
        citySlug: "los-corales",
        price: 245000,
        type: "condo",
        bedrooms: 2,
        bathrooms: 2,
        squareMeters: 95,
        status: "for-sale",
        pool: true, oceanView: false, golfView: false, furnished: false,
        amenities: ["Massive Winding Pool", "Sports Area", "Boutique Shops", "Business Center", "Gym", "Private Parking", "Spa", "24/7 Security", "Terrace", "Restaurant"],
        desc: "Experience the pinnacle of luxury living in the upcoming Atlántida mega-project located in the highly sought-after Los Corales neighborhood of Bávaro. Valued at $400 million, this avant-garde circular design development will feature a massive, winding centralized pool that mimics a natural river. The property is a 95 sqm 2-bedroom condo offering expansive private terraces to enjoy the Caribbean breeze. \n\nThis pre-construction deal (scheduled for delivery in 2026) is an investor's dream, perfectly situated just 15 minutes from Punta Cana International Airport and a short walk to Bávaro Beach. The community features world-class amenities including a state-of-the-art gym, a business center, boutique shopping, and diverse medical facilities nearby. \n\nBy securing your unit now, you lock in early pricing and benefit from CONFOTUR tax exemptions (no 3% property transfer tax and 15 years of property tax exemption). Perfect for high-ROI vacation rentals or a luxurious full-time residence in the Dominican Republic.",
        desc_es: "Experimente el pináculo de la vida de lujo en el próximo megaproyecto Atlántida ubicado en el codiciado barrio de Los Corales en Bávaro. Valorado en $400 millones, este desarrollo de diseño circular de vanguardia contará con una piscina centralizada enorme y serpenteante que imita un río natural. La propiedad es un condominio de 2 habitaciones de 95 metros cuadrados que ofrece amplias terrazas privadas para disfrutar de la brisa caribeña.\n\nEsta oferta de preconstrucción (programada para entrega en 2026) es el sueño de un inversor, con ubicación ideal a 15 minutos del Aeropuerto Internacional de Punta Cana."
    },
    {
        title: "Oceanfront 3-Bed Penthouse in Ocean Bay",
        title_es: "Penthouse de 3 Hab Frente al Mar en Ocean Bay",
        city: "Bávaro, Punta Cana",
        citySlug: "bavaro",
        price: 850000,
        type: "penthouse",
        bedrooms: 3,
        bathrooms: 3.5,
        squareMeters: 220,
        status: "for-sale",
        pool: true, oceanView: true, golfView: false, furnished: true,
        amenities: ["Private Beach Access", "Infinity Pool", "Oceanfront Bar", "Luxury Spa", "Kids Club", "Gourmet Restaurant", "Concierge", "Underground Parking", "Balcony", "Jacuzzi"],
        desc: "Ocean Bay promises the ultimate beachfront lifestyle in Bávaro, Punta Cana. Scheduled for completion in late 2026, this striking 3-bedroom, 3.5-bathroom penthouse is defining Caribbean luxury. Stretching across 220 sqm of elegantly appointed living space, you’ll enjoy sweeping, unobstructed ocean views from your massive private rooftop terrace equipped with a jacuzzi.\n\nThe development limits capacity to 196 exclusive condos, ensuring privacy and serenity. Owners have direct, private access to the pristine white sands of Bávaro beach. Pamper yourself daily with 5-star resort amenities including a luxury spa, oceanfront bar, fitness center, and a dedicated kids club.\n\nWith high-speed internet, premium property management services for rentals, and close proximity to downtown nightlife, this property acts as both a quiet sanctuary and a high-yield investment vehicle. Fully furnished with high-end European finishings, this property is turnkey-ready upon delivery.",
        desc_es: "Ocean Bay promete el mejor estilo de vida frente al mar en Bávaro, Punta Cana. Programado para completarse a fines de 2026, este sorprendente penthouse de 3 habitaciones y 3.5 baños redefine el lujo caribeño. Con 220 metros cuadrados de espacio elegantemente decorado, disfrutará de vistas panorámicas ininterrumpidas del océano desde su enorme terraza privada en la azotea."
    },
    {
        title: "Bali-Inspired 1-Bed Retreat in TAMAN",
        title_es: "Retiro de 1 Hab Inspirado en Bali en TAMAN",
        city: "Verón, Punta Cana",
        citySlug: "veron",
        price: 135000,
        type: "condo",
        bedrooms: 1,
        bathrooms: 1,
        squareMeters: 65,
        status: "for-sale",
        pool: true, oceanView: false, golfView: false, furnished: false,
        amenities: ["Balinese Gardens", "Yoga Decks", "Meditation Zones", "Multiple Pools", "Gated Security", "Eco-friendly Construction", "Co-working Space", "Cafe", "Fitness Center", "BBQ Area"],
        desc: "Find your Zen in TAMAN, an intimately designed Bali-inspired residential community located in the rapidly appreciating Verón-Bávaro corridor. Set for Phase 1 delivery in December 2026, this 1-bedroom, 65 sqm condo is the perfect blend of modern comfort and tropical tranquility.\n\nDesigned with nature in mind, TAMAN weaves lush Balinese gardens, peaceful meditation zones, and beautiful yoga decks into common living spaces to promote wellness. Surrounded by flowing water features and eco-friendly architecture, you will quickly forget the outside world.\n\nDespite its peaceful envelope, you are securely positioned just minutes from Downtown Punta Cana and major thoroughfares. The property comes with access to beautiful pools, a fitness center, and a modern co-working cafe—perfect for digital nomads. This is a low barrier-to-entry investment with high projected appreciation, ideal for long-term rentals or Airbnb.",
        desc_es: "Encuentre su Zen en TAMAN, una comunidad residencial finamente diseñada inspirada en Bali ubicada en el corredor Verón-Bávaro de rápida apreciación. Listo para la entrega de la Fase 1 en diciembre de 2026, este condominio de 1 habitación y 65 metros cuadrados es la combinación perfecta de comodidad moderna y tranquilidad tropical."
    },
    {
        title: "Boutique Airbnb Apartment in BOHEMIA El Cortecito",
        title_es: "Apartamento Boutique en BOHEMIA El Cortecito",
        city: "El Cortecito, Bávaro",
        citySlug: "el-cortecito",
        price: 155000,
        type: "condo",
        bedrooms: 1,
        bathrooms: 1,
        squareMeters: 70,
        status: "for-sale",
        pool: true, oceanView: false, golfView: false, furnished: false,
        amenities: ["Rooftop Pool", "Walking Distance to Beach", "Lounge Area", "BBQ Service", "24/7 Security", "Property Management", "Turnkey Rental Program", "Smart Lock Entry", "Elevator"],
        desc: "Designed purely with the savvy investor in mind, BOHEMIA is an exclusive boutique complex rising in El Cortecito—the vibrant, walkable heart of Bávaro. This 70 sqm 1-bedroom apartment provides everything a renter desires, including a stunning rooftop pool and lounge area with panoramic views of the neighborhood.\n\nWith an anticipated completion in 2027, this unit places guests right in the middle of local flavor, surrounded by beach bars, diverse restaurants, and artisan shops. The pristine Bávaro Beach is just a short, safe walk away. \n\nThe layout optimizes space for short-term renters with a spacious bedroom, high-quality finishes, and smart home entry infrastructure. Supported by on-site property management, this property is a stress-free, high-yield asset designed to generate consistent Airbnb revenue in a historically proven tourist zone.",
        desc_es: "Diseñado exclusivamente para el inversor astuto, BOHEMIA es un complejo boutique exclusivo que se levanta en El Cortecito, el corazón vibrante y transitable de Bávaro. Este apartamento de 1 habitación de 70 metros cuadrados ofrece todo lo que un inquilino desea, incluida una impresionante piscina en la azotea y sala de estar."
    },
    {
        title: "Ultra-Luxury Wyndham Penthouse in Cap Cana",
        title_es: "Penthouse de Ultra Lujo Wyndham en Cap Cana",
        city: "Cap Cana",
        citySlug: "cap-cana",
        price: 1250000,
        type: "penthouse",
        bedrooms: 2,
        bathrooms: 2.5,
        squareMeters: 280,
        status: "for-sale",
        pool: true, oceanView: true, golfView: true, furnished: true,
        amenities: ["Rooftop Infinity Pool", "Sky Bar", "Private Gym", "Valet Parking", "Concierge Service", "Wyndham Hotel Management", "Juanillo Beach Access", "Marina Access", "Tennis Courts", "Billiards Room"],
        desc: "Located within the gated luxury of Cap Cana, this Eliun Real Estate Development defines exclusivity. Managed by the prestigious Wyndham Hotels & Resorts under their Dolce brand, this magnificent 2-bedroom, 280 sqm penthouse is a trophy asset. Delivery is scheduled for 2027.\n\nThe penthouse boasts an expansive rooftop infinity pool seamlessly blending with the Caribbean horizon. Fully furnished with high-end designer pieces, your home comes with exclusive access to world-class resort amenities: a sky bar, private gym, valet parking, and comprehensive concierge services. \n\nCap Cana offers an elite lifestyle; you are minutes away from the internationally renowned Punta Espada Golf Course, the largest inland marina in the Caribbean, and the pristine sands of Juanillo Beach. This property benefits from CONFOTUR tax exemptions, maximizing your investment return while placing you in the most secure community in the Dominican Republic.",
        desc_es: "Ubicado dentro del lujo cerrado de Cap Cana, este desarrollo inmobiliario de Eliun define la exclusividad. Administrado por los prestigiosos Wyndham Hotels & Resorts bajo su marca Dolce, este magnífico penthouse de 2 habitaciones es un trofeo de inversión. La entrega está programada para 2027."
    },
    {
        title: "Eco-Friendly 2-Bed Residence in The Seed",
        title_es: "Residencia Ecológica de 2 Habitaciones en The Seed",
        city: "City Place, Downtown",
        citySlug: "city-place",
        price: 215000,
        type: "condo",
        bedrooms: 2,
        bathrooms: 2,
        squareMeters: 90,
        status: "for-sale",
        pool: true, oceanView: false, golfView: false, furnished: false,
        amenities: ["Organic Gardens", "Cenote-style Pool", "Wellness Center", "Yoga Pavilion", "Co-working Space", "Gated Entry", "Lush Landscaping", "Bicycle Paths", "Kids Play Area", "Pet Park"],
        desc: "Embrace sustainable luxury at The Seed, a massive eco-conscious residential project situated in the emerging City Place district of Downtown Punta Cana. Expected to be delivered in phases through 2028, this 90 sqm 2-bedroom residence is surrounded by nature while offering the conveniences of urban living.\n\nThe Seed's architecture mimics the natural curves of seeds and leaves, surrounded by vast networks of cenote-style swimming pools and organic gardens. Residents enjoy a unique wellness center, yoga pavilions, and modern co-working spaces. \n\nCity Place is envisioned as the new mini-city hub of Punta Cana, soon to feature a walking mall, private hospitals, an IKEA, and a 30,000 sqm crystal lagoon nearby. This condo represents a fantastic entry-level investment into what will become the most robust commercial and residential sector in the region over the coming decade.",
        desc_es: "Adopte el lujo sostenible en The Seed, un enorme proyecto residencial con conciencia ecológica situado en el emergente distrito de City Place en el centro de Punta Cana. Con entrega proyectada hasta 2028, esta residencia de 90 metros cuadrados está rodeada de naturaleza y ofrece las comodidades de la vida urbana."
    },
    {
        title: "Danzza Luxury Golf Condo in Cap Cana",
        title_es: "Condo de Lujo con Vistas al Golf Danzza en Cap Cana",
        city: "Cap Cana",
        citySlug: "cap-cana",
        price: 495000,
        type: "condo",
        bedrooms: 2,
        bathrooms: 2.5,
        squareMeters: 140,
        status: "for-sale",
        pool: true, oceanView: false, golfView: true, furnished: false,
        amenities: ["Golf Course Views", "Private Concierge", "Lounge Pool", "Gourmet Kitchen", "Underground Parking", "Cap Cana Beach Club Access", "Smart Home Tech", "Tennis Courts", "24/7 Patrol", "Equestrian Center Access"],
        desc: "Elevate your standard of living at Danzza Luxury Residences in the heart of Cap Cana. This elegant 2-bedroom, 140 sqm condo offers unparalleled views of rolling green fairways, making it an idyllic sanctuary for golf enthusiasts and luxury seekers alike. Delivery is targeted for late 2026.\n\nA flowing open-concept design is anchored by a gourmet European kitchen and floor-to-ceiling windows that bathe the living spaces in natural light. Living in Danzza means you are part of a highly exclusive enclave with access to dedicated concierges, underground parking, and smart home technology integrations.\n\nAs a Cap Cana resident, you unlock access to an elite infrastructure: the Punta Espada Golf Course, exclusive beach clubs on Juanillo Beach, a mega-yacht marina, and an equestrian center. This is refined Caribbean living with immense capital appreciation potential.",
        desc_es: "Eleve su nivel de vida en Danzza Luxury Residences en el corazón de Cap Cana. Este elegante condominio de 2 habitaciones y 140 metros cuadrados ofrece vistas incomparables de las verdes calles del campo de golf, ideal para entusiastas del golf. La entrega está prevista para finales de 2026."
    },
    {
        title: "Pioneering 1-Bed Condo at Macao Beach Residences",
        title_es: "Condo de 1 Hab Pionero en Macao Beach Residences",
        city: "Macao",
        citySlug: "macao",
        price: 115000,
        type: "condo",
        bedrooms: 1,
        bathrooms: 1,
        squareMeters: 55,
        status: "for-sale",
        pool: true, oceanView: false, golfView: false, furnished: false,
        amenities: ["Macao Beach Shuttle", "Surfing Club Access", "Eco Trails", "Lagoon Pool", "Outdoor Gym", "BBQ Pavilions", "Secure Entry", "Hammock Garden"],
        desc: "Be a pioneer in the next great Punta Cana destination. Macao Beach Residences offers modern 1-bedroom condos just a short shuttle ride from the famous, pristine waves of Macao Beach. Delivery set for 2026.\n\nHistorically untouched and favored by surfers, Macao is currently undergoing a calculated development boom. This 55 sqm condo offers a ground-level price point with massive upside potential as the region matures. The community embraces the wild beauty of Macao, offering eco trails, a massive central lagoon pool, an outdoor gym, and a relaxing hammock garden.\n\nWhether you are looking for an affordable vacation home, a surfing retreat, or a high-ROI Airbnb asset capitalizing on the growing popularity of Macao, this pre-construction opportunity is unmatched in its price class.",
        desc_es: "Sea un pionero en el próximo gran destino de Punta Cana. Macao Beach Residences ofrece condominios modernos de 1 habitación a solo un corto viaje trasbordo de las famosas y prístinas olas de la playa de Macao. Entrega prevista para 2026."
    },
    {
        title: "Volare Marina Residences Pre-Sale",
        title_es: "Preventa en Volare Marina Residences",
        city: "Cap Cana",
        citySlug: "cap-cana",
        price: 650000,
        type: "condo",
        bedrooms: 3,
        bathrooms: 3,
        squareMeters: 180,
        status: "for-sale",
        pool: true, oceanView: true, golfView: false, furnished: true,
        amenities: ["Marina Views", "Yacht Slips Available", "Infinity Pool", "Wine Cellar", "Private Chef Services", "Helipad Access", "Golf Cart Parking", "Concierge"],
        desc: "Volare represents the pinnacle of nautical lifestyle in Cap Cana. Overlooking the grand Cap Cana Marina, this 3-bedroom, 180 sqm condo is an architectural masterpiece designed for those who appreciate the finer things. Slated for 2026 completion.\n\nWatch mega-yachts cruise into the marina from your private expanded balcony. The condo features ultra-premium finishes, an open layout, and a private wine cellar. Residents of Volare have access to exclusive infinity pools hanging over the water, private chef services, and prioritized yacht slips.\n\nCombining the security and prestige of Cap Cana with the romance of marina living, this fully furnished unit provides incredible rental income potential for the high-net-worth market and is an exceptional personal retreat.",
        desc_es: "Volare representa el pináculo del estilo de vida náutico en Cap Cana. Con vistas a la gran Marina de Cap Cana, este condominio de 3 habitaciones y 180 metros cuadrados es una obra maestra arquitectónica diseñada para quienes aprecian las cosas buenas de la vida. Finalización 2026."
    },
    {
        title: "Juanillo Hills Resort Apartment",
        title_es: "Apartamento de Resort Juanillo Hills",
        city: "Cap Cana",
        citySlug: "cap-cana",
        price: 295000,
        type: "condo",
        bedrooms: 2,
        bathrooms: 2,
        squareMeters: 110,
        status: "for-sale",
        pool: true, oceanView: false, golfView: false, furnished: true,
        amenities: ["Walk to Juanillo Beach", "Resort-style Pool", "Private Cabanas", "Co-working Spaces", "Gym", "Restaurant", "Cap Cana Security", "Rental Program"],
        desc: "Juanillo Hills is an exclusive collection of 60 furnished apartments positioned just minutes from the world-famous white sands of Juanillo Beach in Cap Cana. Expected for delivery in 2026, this 110 sqm 2-bedroom unit is the ultimate turnkey investment.\n\nThe development is designed to operate like a luxury boutique hotel. Owners and guests enjoy a sprawling resort-style pool lined with private cabanas, modern co-working spaces, and a state-of-the-art gym. A full management rental program ensures your investment yields passive income while you are away.\n\nExplore all that Cap Cana has to offer—from the Scape Park eco-adventure reserve to fine dining at the marina—all from a brilliantly designed home base.",
        desc_es: "Juanillo Hills es una colección exclusiva de 60 apartamentos amueblados ubicados a solo minutos de las famosas arenas blancas de la playa de Juanillo en Cap Cana. Con entrega esperada en 2026, esta unidad de 2 hab es la mejor inversión llave en mano."
    },
    {
        title: "Stella Marina Masterpiece Villa",
        title_es: "Villa Maestra Stella Marina",
        city: "Cocotal Golf & Country Club",
        citySlug: "cocotal",
        price: 850000,
        type: "villa",
        bedrooms: 4,
        bathrooms: 4.5,
        squareMeters: 450,
        status: "for-sale",
        pool: true, oceanView: false, golfView: true, furnished: false,
        amenities: ["Private Pool", "Golf Course Frontage", "Maid Quarters", "Double-Gated Security", "Meliá Beach Club Access", "Private Driveway", "Terrace with BBQ", "High Ceilings"],
        desc: "Experience grandeur at Stella Marina Villas, located in the prestigious Cocotal Golf & Country Club in Bávaro. This gorgeous pre-construction 4-bedroom villa spans an impressive 450 sqm of luxury living space directly fronting the 27-hole championship golf course.\n\nDesigned with towering high ceilings and massive sliding glass doors, the villa seamlessly integrates indoor living with the tropical outdoors. A magnificent private pool, outdoor BBQ terrace, and designated maid’s quarters provide ultimate comfort. \n\nCocotal is famous for its safety and family-friendly environment. Owners receive exclusive perks, including access to the 5-star Meliá Caribe Beach resort and its private beach clubs. A phenomenal primary residence for discerning families. Delivery in late 2026.",
        desc_es: "Experimente la grandeza en Stella Marina Villas, ubicada en el prestigioso Cocotal Golf & Country Club en Bávaro. Esta magnífica villa en preconstrucción de 4 habitaciones abarca unos impresionantes 450 metros cuadrados de espacio frente al campo de golf de 27 hoyos."
    },
    {
        title: "CANA Cove Luxury Apartment",
        title_es: "Apartamento de Lujo CANA Cove",
        city: "Cana Bay",
        citySlug: "cana-bay",
        price: 320000,
        type: "condo",
        bedrooms: 2,
        bathrooms: 2,
        squareMeters: 130,
        status: "for-sale",
        pool: true, oceanView: false, golfView: true, furnished: false,
        amenities: ["Hard Rock Golf Access", "Private Beach Club", "Tennis Courts", "Paddle Courts", "Infinity Pool", "24/7 Security", "Discounts at Hard Rock", "Rental Management"],
        desc: "Welcome to CANA Cove, a luxury apartment project nestled within the exclusive Cana Bay community. This 130 sqm 2-bedroom condo offers an elegant lifestyle wrapped around the Jack Nicklaus signature golf course. Delivery is slated for 2027.\n\nThe apartment features contemporary architecture, spacious layouts, and top-tier finishes. Residents are granted access to the phenomenal Cana Bay Beach Club, complete with an infinity pool overlooking the ocean, tennis courts, and paddle courts.\n\nBecause of its proximity to the Hard Rock Hotel and Casino, owners receive special discounts on day passes, restaurants, and golf. This is a highly sought-after area for high-end vacation rentals, making it a stellar investment.",
        desc_es: "Bienvenido a CANA Cove, un proyecto de apartamentos de lujo ubicado dentro de la exclusiva comunidad de Cana Bay. Este condominio de 2 habitaciones ofrece un estilo de vida elegante envuelto alrededor del campo de golf de Jack Nicklaus. Entrega en 2027."
    },
    {
        title: "Palace Suites Downtown Investment",
        title_es: "Inversión en Palace Suites Downtown",
        city: "Downtown Punta Cana",
        citySlug: "downtown-punta-cana",
        price: 139000,
        type: "condo",
        bedrooms: 1,
        bathrooms: 1,
        squareMeters: 60,
        status: "for-sale",
        pool: true, oceanView: false, golfView: false, furnished: true,
        amenities: ["Walk to Coco Bongo", "Rooftop Lounge", "Co-working Space", "Lobby", "Underground Parking", "Gym", "Concierge", "Turnkey Furniture Package"],
        desc: "Maximize your ROI with Palace Suites, a development strategically located in the energetic heart of Downtown Punta Cana. The 60 sqm 1-bedroom condo is crafted specifically to dominate the short-term rental market. Expected delivery 2026.\n\nLocation is everything: guests can safely walk to Coco Bongo, San Juan Shopping Center, diverse international dining, and vibrant nightlife. The suites offer an array of modern amenities including a lively rooftop lounge, a fully equipped gym, and professional lobby concierge services.\n\nSold with a turnkey furniture package and optionally integrated into a hands-off property management pool, investors can sit back and collect revenue immediately upon delivery while tapping into the high-demand downtown transit market.",
        desc_es: "Maximice su ROI con Palace Suites, un desarrollo ubicado estratégicamente en el corazón energético de Downtown Punta Cana. Este condominio de 1 habitación de 60 metros cuadrados está diseñado específicamente para dominar el mercado de alquiler a corto plazo."
    },
    {
        title: "Galia Oceanview Masterpiece",
        title_es: "Obra Maestra con Vista al Mar Galia",
        city: "Cap Cana",
        citySlug: "cap-cana",
        price: 780000,
        type: "condo",
        bedrooms: 3,
        bathrooms: 3.5,
        squareMeters: 210,
        status: "reserved",
        pool: true, oceanView: true, golfView: true, furnished: false,
        amenities: ["Caribbean Ocean Views", "Golf Views", "Infinity Pool", "Wine Cellar", "Private Gym", "Underground Parking", "Maid Quarters", "Cap Cana Amenities", "Smart Home"],
        desc: "Galia is an architectural triumph in Cap Cana, blending ocean views with sweeping golf course greens. This highly coveted 3-bedroom, 210 sqm residence is currently reserved due to its incredibly high demand prior to its 2026 completion.\n\nIt features soaring ceilings, wrap-around balconies, a private maid's quarters, and cutting-edge smart home technologies. The community offers a private gym, a curated wine cellar for residents, and a majestic infinity pool.\n\nThis property serves as an example of the rapid absorption rate of premium, dual-view (ocean and golf) properties in the Cap Cana market.",
        desc_es: "Galia es un triunfo arquitectónico en Cap Cana, combinando vistas al océano con amplios campos de golf. Esta codiciada residencia de 3 habitaciones y 210 metros cuadrados está actualmente reservada debido a su increíblemente alta demanda."
    },
    {
        title: "Ocean Paradise Luxury Beach Condos",
        title_es: "Condos de Lujo en la Playa Ocean Paradise",
        city: "Bávaro, Punta Cana",
        citySlug: "bavaro",
        price: 185000,
        type: "condo",
        bedrooms: 1,
        bathrooms: 1.5,
        squareMeters: 80,
        status: "for-sale",
        pool: true, oceanView: true, golfView: false, furnished: false,
        amenities: ["Direct Beach Access", "Private Beach Club", "Infinity Pool", "Concierge", "Swim-up Bar", "Walkable Neighborhood", "Security", "Lobby"],
        desc: "Step directly onto the white sands of Bávaro Beach from the Ocean Paradise Luxury Condos. Offering a rare beachfront pre-construction opportunity in a mature neighborhood, this 1-bedroom, 80 sqm condo is expected to be delivered in late 2026.\n\nThe development features a private beach club, a massive infinity pool with a swim-up bar, and 5-star lobby concierge services. Situated in an extremely walkable sector of Bávaro, you are steps away from excellent local dining, grocery stores, and beach activities.\n\nFront-line beach properties historically hold value better than any other asset class in Punta Cana. This is a blue-chip real estate investment in the Caribbean.",
        desc_es: "Pise directamente las arenas blancas de la playa de Bávaro desde Ocean Paradise Luxury Condos. Ofreciendo una rara oportunidad de preconstrucción frente a la playa en un vecindario maduro, se espera que este condominio de 1 habitación se entregue a fines de 2026."
    },
    {
        title: "Vista Cana Smart Eco-Villa",
        title_es: "Eco-Villa Inteligente en Vista Cana",
        city: "Vista Cana",
        citySlug: "vista-cana",
        price: 350000,
        type: "villa",
        bedrooms: 3,
        bathrooms: 3,
        squareMeters: 220,
        status: "for-sale",
        pool: true, oceanView: false, golfView: false, furnished: false,
        amenities: ["Solar Panels", "Smart Home Integration", "Private Pool", "Artificial Beach Access", "Sports Complex", "Executive Golf Course", "Lake Club", "Gated Security", "Bike Trails"],
        desc: "Welcome to the future of Caribbean living. This spectacular 3-bedroom, 220 sqm Smart Eco-Villa is located in Vista Cana, a revolutionary master-planned smart city. Delivery expected in 2026.\n\nThe villa is equipped with solar panel infrastructure, EV charging capability, and full smart home integration for lighting, climate, and security. It features a private backyard oasis with a pristine pool and covered terrace.\n\nVista Cana residents enjoy an artificial saltwater lake and beach, a night-lit executive golf course, a massive sports complex, and miles of ecological biking trails. A perfect neighborhood for young professionals, active families, and forward-thinking investors.",
        desc_es: "Bienvenido al futuro de la vida en el Caribe. Esta espectacular Eco-Villa inteligente de 3 habitaciones y 220 metros cuadrados se encuentra en Vista Cana, una revolucionaria ciudad inteligente planificada maestra. Entrega esperada en 2026."
    },
    {
        title: "Punta Blanca Golf Course Estate",
        title_es: "Finca en el Campo de Golf Punta Blanca",
        city: "Punta Blanca",
        citySlug: "punta-blanca",
        price: 600000,
        type: "villa",
        bedrooms: 4,
        bathrooms: 4.5,
        squareMeters: 380,
        status: "for-sale",
        pool: true, oceanView: false, golfView: true, furnished: true,
        amenities: ["18-Hole Golf Course", "Private Pool", "Clubhouse Access", "Private Beach Club", "Tennis", "Security Patrol", "Landscaped Gardens"],
        desc: "Nestled alongside the challenging 18-hole Punta Blanca Golf Course, this magnificent 4-bedroom estate offers 380 sqm of refined living space. This is a rare, fully completed and furnished resale opportunity in excellent condition.\n\nThe property features expansive living areas that open out to a beautifully landscaped garden and a large private pool boasting direct views over the fairways. \n\nPunta Blanca owners enjoy tranquility, robust security, access to the clubhouse, and a private beach club located on Bávaro Beach. An ideal retirement home or Caribbean family retreat.",
        desc_es: "Ubicada junto al desafiante campo de golf Punta Blanca de 18 hoyos, esta magnífica propiedad de 4 habitaciones ofrece 380 metros cuadrados de espacio habitable refinado. Esta es una rara oportunidad de reventa completamente terminada y amueblada."
    },
    {
        title: "Family Home in Punta Cana Village",
        title_es: "Hogar Familiar en Punta Cana Village",
        city: "Punta Cana Village",
        citySlug: "punta-cana-village",
        price: 450000,
        type: "villa",
        bedrooms: 3,
        bathrooms: 2.5,
        squareMeters: 260,
        status: "for-sale",
        pool: false, oceanView: false, golfView: false, furnished: false,
        amenities: ["Walking Distance to School", "Supermarket Nearby", "Community Parks", "24/7 Security", "Airport Proximity", "Restaurants", "Quiet Cul-de-sac", "Private Yard"],
        desc: "Situated in the highly desirable and family-centric Punta Cana Village, this 3-bedroom, 260 sqm resale home is perfect for expats relocating to the Dominican Republic. \n\nLocated on a quiet, tree-lined cul-de-sac, the home features a spacious private yard (with room to add a pool), a modern kitchen, and an airy living room. \n\nPunta Cana Village is practically an extension of the airport infrastructure, meaning you have access to the country's best international school, a major supermarket (Nacional), banks, pharmacies, and a vibrant dining plaza all within walking or golf-cart distance. Safe, community-oriented, and highly convenient.",
        desc_es: "Ubicada en el muy deseable y familiar Punta Cana Village, esta casa de reventa de 3 habitaciones y 260 metros cuadrados es perfecta para expatriados que se mudan a la República Dominicana."
    },
    {
        title: "Prime Commercial/Residential Lot in Macao",
        title_es: "Lote Comercial/Residencial Premium en Macao",
        city: "Macao",
        citySlug: "macao",
        price: 95000,
        type: "land",
        bedrooms: 0,
        bathrooms: 0,
        squareMeters: 1000,
        status: "for-sale",
        pool: false, oceanView: false, golfView: false, furnished: false,
        amenities: ["Close to Beach", "Paved Road Access", "Electricity Access", "Water Access", "Commercial Zoning", "High Appreciation Zone"],
        desc: "A golden opportunity to secure 1,000 sqm of prime land in the rapidly emerging Macao sector. As development pushes north from Bávaro, Macao is currently experiencing exponential land value growth.\n\nThis flat, build-ready lot features paved road access and proximity to main utilities. With mixed commercial and residential zoning, the possibilities are endless: build a multi-unit Airbnb complex, a boutique surf hostel, or your own private custom villa. \n\nLocated just a 5-minute drive from the public sands of Macao Beach, this land represents a highly strategic hold or development play in Punta Cana's next major tourist corridor.",
        desc_es: "Una oportunidad dorada para asegurar 1,000 metros cuadrados de terreno de primera calidad en el sector de Macao en rápida aparición. A medida que el desarrollo avanza hacia el norte desde Bávaro, Macao experimenta un importante crecimiento del valor de la tierra."
    },
    {
        title: "Lakeview Lot in Vista Cana",
        title_es: "Lote con Vista al Lago en Vista Cana",
        city: "Vista Cana",
        citySlug: "vista-cana",
        price: 135000,
        type: "land",
        bedrooms: 0,
        bathrooms: 0,
        squareMeters: 650,
        status: "for-sale",
        pool: false, oceanView: false, golfView: false, furnished: false,
        amenities: ["Lake Views", "Gated Security", "Build Custom Villa", "All Utility Hookups", "Access to Vista Cana Amenities", "Paved Streets", "Smart City Infrastructure"],
        desc: "Design and build the Caribbean home of your dreams on this exclusive 650 sqm lakeview lot within the gates of Vista Cana. Parcels in this specific sub-community are highly prized due to their direct views of the central lake.\n\nThe lot is fully prepped for construction with all underground utility hookups (water, electricity, fiber optic) ready to utilize. \n\nPurchasing land in Vista Cana guarantees you access to all the mega-amenities of the smart city, including the artificial beach, sports complex, and golf course. Protect against inflation by holding the land, or immediately begin construction on a high-ROI luxury villa.",
        desc_es: "Diseñe y construya la casa caribeña de sus sueños en este exclusivo lote de 650 metros cuadrados con vista al lago dentro de las puertas de Vista Cana. Las parcelas en esta subcomunidad son muy apreciadas debido a sus vistas directas de los lagos."
    }
];

function getRandomProperties() {
    return propertiesData.map(p => {
        // Create highly unique slug to avoid collisions
        const uniqueId = Math.random().toString(36).substring(2, 6);
        const slug = `${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${uniqueId}`;

        let images = [];
        if (p.type === 'condo' || p.type === 'penthouse') {
            images = getRandomImages(CONDO_IMAGES, 5);
        } else if (p.type === 'villa') {
            images = getRandomImages(VILLA_IMAGES, 5);
        } else {
            images = getRandomImages(LAND_IMAGES, 4);
        }

        return {
            ...p,
            slug,
            images,
            description: p.desc,
            description_es: p.desc_es,
            featured: Math.random() > 0.8 // 20% featured
        };
    }).map(({ desc, desc_es, ...rest }) => rest);
}

async function run() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);

    console.log('Clearing existing mock properties...');
    await Property.deleteMany({});

    console.log('Generating 20 highly realistic Punta Cana mock properties...');
    const properties = getRandomProperties();

    await Property.insertMany(properties);
    console.log('Successfully seeded 20 realistic properties.');

    process.exit(0);
}

run().catch(console.error);
