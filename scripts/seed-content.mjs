// Seed script for Blog Posts and Neighborhoods
// Run with: node scripts/seed-content.mjs

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('MONGODB_URI not found in .env.local');
    process.exit(1);
}

await mongoose.connect(MONGODB_URI);
console.log('✅ Connected to MongoDB');

// ─── Post Schema ───
const PostSchema = new mongoose.Schema({
    title: String, title_es: String,
    slug: { type: String, unique: true },
    content: String, content_es: String,
    excerpt: String, excerpt_es: String,
    coverImage: String,
    author: String,
    category: { type: String, enum: ['market-update', 'buying-guide', 'lifestyle', 'news'] },
    publishedAt: { type: Date, default: Date.now },
    featured: { type: Boolean, default: false },
}, { timestamps: true });

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

// ─── Neighborhood Schema ───
const NeighborhoodSchema = new mongoose.Schema({
    name: String, name_es: String,
    slug: { type: String, unique: true },
    description: String, description_es: String,
    heroImage: String,
    gallery: [String],
    highlights: [String],
    highlights_es: [String],
    mapCoordinates: { lat: Number, lng: Number },
    averagePrice: Number,
}, { timestamps: true });

const Neighborhood = mongoose.models.Neighborhood || mongoose.model('Neighborhood', NeighborhoodSchema);

// ═══════════════════════════════════════════════════════
//  BLOG POSTS
// ═══════════════════════════════════════════════════════
const blogPosts = [
    {
        title: 'Punta Cana Real Estate Market 2026: What Every Foreign Buyer Needs to Know',
        title_es: 'Mercado Inmobiliario de Punta Cana 2026: Lo Que Todo Comprador Extranjero Necesita Saber',
        slug: 'punta-cana-real-estate-market-2026',
        excerpt: 'With property values appreciating at 8.4% annually and over 12 million tourists visiting each year, Punta Cana remains the Caribbean\'s hottest investment destination. Here\'s your complete 2026 market overview.',
        excerpt_es: 'Con valores de propiedad apreciándose un 8.4% anual y más de 12 millones de turistas visitando cada año, Punta Cana sigue siendo el destino de inversión más atractivo del Caribe. Aquí está tu resumen completo del mercado 2026.',
        content: `The Punta Cana real estate market continues to defy expectations in 2026. Between 2019 and 2025, condos in the region appreciated at an impressive 8.4% compound annual rate, and forecasts for 2026 suggest continued price growth of 6-8% annually.

**Tourism Driving Demand**

The Dominican Republic welcomed over 12 million visitors in 2025, with Punta Cana International Airport handling more than 11 million passengers — a 9.9% increase from the previous year. This massive tourism flow directly fuels the short-term rental market, creating consistent demand for investor-owned properties.

**Foreign Ownership Made Easy**

Under Law 16-95, foreigners can own property outright in Punta Cana without special permits. North American and European investors now account for nearly 40% of all real estate transactions in the region. Dominican banks like Scotiabank and Banco Popular offer mortgages to foreigners, typically financing 50-70% of the property value.

**CONFOTUR Tax Benefits**

The CONFOTUR law offers powerful tax incentives for qualifying properties: exemptions from the 3% property transfer tax and annual property taxes for up to 15 years. This can save investors tens of thousands of dollars over the holding period.

**Investment Hotspots by Neighborhood**

- **Bávaro/Los Corales**: Highest Airbnb demand, 9-11% net yields. Popular with snowbirds and digital nomads.
- **Cap Cana**: Luxury weekly rentals, 7-9% net yields. Golf tourism and high-net-worth clientele.
- **Vista Cana**: Digital nomad haven, 6-7% net yields. Long-stay renters.
- **Downtown Punta Cana**: Business travelers, 6-8% net yields.
- **Cana Bay/Hard Rock**: Resort visitors and golf groups, 8-10% net yields.

**Pre-Construction vs. Resale**

Pre-construction opportunities continue to offer double-digit upside due to rising construction material costs that moderate new supply. However, resale properties offer immediate rental income. Your choice should match your time horizon and risk tolerance.

**The Bottom Line**

With GDP growth projected at 4-5%, macro stability, and continued infrastructure investment, the Dominican Republic has firmly established itself as a resilient Caribbean investment destination. Punta Cana's combination of tourism demand, favorable legal framework, and strong appreciation makes it one of the smartest real estate plays in the region.`,
        content_es: `El mercado inmobiliario de Punta Cana sigue superando expectativas en 2026. Entre 2019 y 2025, los condominios de la región se apreciaron a una impresionante tasa compuesta anual del 8.4%, y las proyecciones para 2026 sugieren un crecimiento continuo de precios del 6-8% anual.

**El Turismo Impulsa la Demanda**

La República Dominicana recibió más de 12 millones de visitantes en 2025, con el Aeropuerto Internacional de Punta Cana procesando más de 11 millones de pasajeros — un aumento del 9.9% respecto al año anterior. Este flujo turístico masivo alimenta directamente el mercado de alquileres a corto plazo.

**Propiedad Extranjera Sin Complicaciones**

Bajo la Ley 16-95, los extranjeros pueden poseer propiedades directamente en Punta Cana sin permisos especiales. Los inversionistas norteamericanos y europeos representan casi el 40% de todas las transacciones inmobiliarias en la región.

**Beneficios Fiscales CONFOTUR**

La ley CONFOTUR ofrece poderosos incentivos fiscales: exenciones del impuesto de transferencia de propiedad del 3% y de impuestos anuales sobre la propiedad por hasta 15 años.

**Puntos de Inversión por Vecindario**

- **Bávaro/Los Corales**: Mayor demanda en Airbnb, rendimientos netos del 9-11%.
- **Cap Cana**: Alquileres semanales de lujo, rendimientos netos del 7-9%.
- **Vista Cana**: Paraíso para nómadas digitales, rendimientos netos del 6-7%.
- **Downtown Punta Cana**: Viajeros de negocios, rendimientos netos del 6-8%.

**En Resumen**

Con un crecimiento del PIB proyectado al 4-5%, estabilidad macroeconómica e inversión continua en infraestructura, Punta Cana sigue siendo una de las jugadas inmobiliarias más inteligentes de la región.`,
        coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
        author: 'LASS Realty Team',
        category: 'market-update',
        publishedAt: new Date('2026-03-01'),
        featured: true,
    },
    {
        title: 'Complete Guide to Buying Property in the Dominican Republic as a Foreigner',
        title_es: 'Guía Completa Para Comprar Propiedad en República Dominicana Como Extranjero',
        slug: 'buying-property-dominican-republic-foreigner-guide',
        excerpt: 'From legal requirements to financing options, closing costs, and tax incentives — everything you need to know before purchasing your dream home in Punta Cana.',
        excerpt_es: 'Desde requisitos legales hasta opciones de financiamiento, costos de cierre e incentivos fiscales — todo lo que necesitas saber antes de comprar tu casa soñada en Punta Cana.',
        content: `Buying property in the Dominican Republic as a foreigner is refreshingly straightforward. Under Law 16-95, there are no restrictions on foreign property ownership — you have the same rights as Dominican citizens. Here's your step-by-step guide.

**Step 1: Choose Your Investment Strategy**

Before browsing listings, determine your goal:
- **Vacation home**: Properties near beaches and golf courses in Cap Cana or Bávaro.
- **Rental investment**: High-traffic areas like Los Corales for Airbnb yields.
- **Retirement**: Gated communities like Cocotal with resort-style amenities.
- **Appreciation play**: Pre-construction projects in emerging areas like Vista Cana.

**Step 2: Understand Costs**

Total closing costs typically range from 4.5% to 7% of the purchase price:
- **Property Transfer Tax**: 3% (waived under CONFOTUR for qualifying properties)
- **Legal fees**: 1-1.5%
- **Title registration**: 0.5%
- **Due diligence**: varies

**Step 3: Verify the Title**

This is critical. Ensure the property has a proper "Certificado de Título" (Certificate of Title) — not just "possession rights." A qualified Dominican attorney should conduct a thorough title search at the Registro de Títulos.

**Step 4: Financing Options**

Dominican banks offer mortgages to foreigners:
- **Loan-to-Value**: 50-70% of the property value
- **Interest rates**: ~11% for peso-denominated, ~8% for USD-denominated loans
- **Term**: Up to 20 years
- Banks: Scotiabank, Banco Popular Dominicano, Banco Lopez de Haro

Many developers also offer direct financing with lower interest rates during construction phases.

**Step 5: Close and Register**

Once under contract, your attorney will guide you through the closing process, transfer tax payment, and title registration. The entire process typically takes 60-90 days.

**Annual Costs to Expect**

- **Property tax**: Zero for properties below the exemption threshold (~$150K); approximately 1% annually for higher-value properties
- **HOA fees**: $100-$800/month depending on the community
- **Insurance**: 0.3-0.5% of property value annually

**Pro Tips**
- Always work with a licensed Dominican attorney
- Visit the property in person before committing
- Choose properties with CONFOTUR certification for maximum tax savings
- Consider joining the Dominican Republic residency program for additional benefits`,
        content_es: `Comprar propiedad en la República Dominicana como extranjero es sorprendentemente sencillo. Bajo la Ley 16-95, no hay restricciones sobre la propiedad extranjera — tienes los mismos derechos que los ciudadanos dominicanos. Aquí está tu guía paso a paso.

**Paso 1: Elige Tu Estrategia de Inversión**

Antes de buscar propiedades, determina tu objetivo:
- **Casa vacacional**: Propiedades cerca de playas y campos de golf en Cap Cana o Bávaro.
- **Inversión de alquiler**: Áreas de alto tráfico como Los Corales para rendimientos de Airbnb.
- **Retiro**: Comunidades cerradas como Cocotal con amenidades estilo resort.

**Paso 2: Entiende los Costos**

Los costos totales de cierre varían del 4.5% al 7% del precio de compra:
- **Impuesto de transferencia**: 3% (exento bajo CONFOTUR para propiedades calificadas)
- **Honorarios legales**: 1-1.5%
- **Registro de título**: 0.5%

**Paso 3: Verifica el Título**

Asegúrate de que la propiedad tenga un "Certificado de Título" adecuado, no solo "derechos de posesión."

**Paso 4: Opciones de Financiamiento**

Los bancos dominicanos ofrecen hipotecas a extranjeros con financiamiento del 50-70% del valor de la propiedad.

**Consejos Profesionales**
- Siempre trabaja con un abogado dominicano licenciado
- Visita la propiedad en persona antes de comprometerte
- Elige propiedades con certificación CONFOTUR para máximo ahorro fiscal`,
        coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200',
        author: 'LASS Realty Team',
        category: 'buying-guide',
        publishedAt: new Date('2026-02-15'),
        featured: true,
    },
    {
        title: 'ROI Analysis: Which Punta Cana Neighborhood Delivers the Highest Rental Returns?',
        title_es: 'Análisis de ROI: ¿Qué Vecindario de Punta Cana Ofrece los Mayores Retornos de Alquiler?',
        slug: 'punta-cana-roi-analysis-rental-returns',
        excerpt: 'We break down the numbers across five key Punta Cana neighborhoods — comparing Airbnb yields, occupancy rates, and total ROI for luxury property investors.',
        excerpt_es: 'Desglosamos los números en cinco vecindarios clave de Punta Cana — comparando rendimientos de Airbnb, tasas de ocupación y ROI total para inversionistas en propiedades de lujo.',
        content: `When investing in Punta Cana real estate, your return on investment depends heavily on which neighborhood you choose. We analyzed data across five key areas to help you make the smartest decision.

**Bávaro / Los Corales — The Income King**
- **Estimated Net Yield**: 9-11%
- **Average Occupancy**: 78-85%
- **Target Guest**: Snowbirds, digital nomads, couples
- **Price Range**: $120K-$350K
- **Why**: Highest Airbnb demand in Punta Cana. Walking distance to beaches, restaurants, and nightlife. Year-round bookings from North American and European travelers.

**Cap Cana — The Luxury Play**
- **Estimated Net Yield**: 7-9%
- **Average Occupancy**: 65-75%
- **Target Guest**: High-net-worth families, golf groups
- **Price Range**: $350K-$5M+
- **Why**: Premium weekly rates offset lower occupancy. Jack Nicklaus-designed Punta Espada golf course is the #1 draw. Higher per-night revenue.

**Cana Bay / Hard Rock Area — The Resort Spillover**
- **Estimated Net Yield**: 8-10%
- **Average Occupancy**: 72-80%
- **Target Guest**: Resort visitors, golf groups, families
- **Price Range**: $150K-$500K
- **Why**: Benefits from proximity to Hard Rock Hotel's massive visitor traffic. Golf course access and resort amenities at residential prices.

**Downtown Punta Cana — The Emerging Middle**
- **Estimated Net Yield**: 6-8%
- **Average Occupancy**: 70-78%
- **Target Guest**: Business travelers, local professionals
- **Price Range**: $80K-$200K
- **Why**: Lowest entry point with steady demand. Growing expat community. Year-round occupancy from non-tourism tenants.

**Vista Cana — The Long-Stay Haven**
- **Estimated Net Yield**: 6-7%
- **Average Occupancy**: 80-88%
- **Target Guest**: Digital nomads, long-stay renters
- **Price Range**: $100K-$250K
- **Why**: Highest occupancy rates due to longer stays. Lower management costs. Growing infrastructure.

**Our Recommendation**

For maximum cash flow: Bávaro/Los Corales.
For long-term appreciation + prestige: Cap Cana.
For balanced risk: Cana Bay/Hard Rock area.

Contact LASS Realty for a personalized investment analysis based on your budget and goals.`,
        content_es: `Cuando inviertes en bienes raíces de Punta Cana, tu retorno de inversión depende en gran medida del vecindario que elijas. Analizamos datos en cinco áreas clave para ayudarte a tomar la decisión más inteligente.

**Bávaro / Los Corales — El Rey del Ingreso**
- **Rendimiento Neto Estimado**: 9-11%
- **Ocupación Promedio**: 78-85%
- **Rango de Precio**: $120K-$350K

**Cap Cana — La Jugada de Lujo**
- **Rendimiento Neto Estimado**: 7-9%
- **Ocupación Promedio**: 65-75%
- **Rango de Precio**: $350K-$5M+

**Cana Bay / Área Hard Rock**
- **Rendimiento Neto Estimado**: 8-10%
- **Ocupación Promedio**: 72-80%
- **Rango de Precio**: $150K-$500K

**Nuestra Recomendación**

Para máximo flujo de efectivo: Bávaro/Los Corales.
Para apreciación a largo plazo + prestigio: Cap Cana.
Para riesgo equilibrado: Área Cana Bay/Hard Rock.

Contacta a LASS Realty para un análisis de inversión personalizado.`,
        coverImage: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&q=80&w=1200',
        author: 'LASS Realty Team',
        category: 'market-update',
        publishedAt: new Date('2026-02-01'),
        featured: false,
    },
    {
        title: 'Living in Punta Cana: A Day in the Life of a Luxury Homeowner',
        title_es: 'Vivir en Punta Cana: Un Día en la Vida de un Propietario de Lujo',
        slug: 'living-in-punta-cana-luxury-lifestyle',
        excerpt: 'Wake up to ocean breezes, golf at Punta Espada by noon, fresh seafood lunch al fresco, and sunsets over your infinity pool. Here\'s what daily life really looks like in Punta Cana.',
        excerpt_es: 'Despierta con la brisa del océano, golf en Punta Espada al mediodía, almuerzo de mariscos frescos al aire libre y atardeceres sobre tu piscina infinita. Así es la vida diaria en Punta Cana.',
        content: `Forget the tourist brochures. Here's what it actually feels like to live in Punta Cana full-time — based on conversations with our homeowner clients who made the move.

**6:30 AM — Morning on the Beach**

The day starts early in the Caribbean. Many of our Cap Cana and Bávaro homeowners begin with a sunrise walk along Juanillo Beach or Playa Bávaro. The beaches are virtually empty at this hour — a stark contrast to the midday crowds. Some residents prefer a sunrise yoga session at their community's wellness center.

**8:00 AM — Coffee Culture**

Punta Cana's cafe scene has evolved dramatically. Fresh Dominican coffee — some of the world's finest — at local cafes or your own terrace. Many gated communities now have on-site cafes and breakfast clubs.

**10:00 AM — Golf or Water Sports**

With over 10 championship courses within a 30-minute radius, golf is a daily ritual, not a special occasion. The Punta Espada course at Cap Cana is consistently ranked #1 in the Caribbean. For water lovers: kitesurfing, deep-sea fishing, sailing, and snorkeling are all minutes away.

**12:30 PM — Al Fresco Lunch**

Fresh-caught lobster, mahi-mahi, or red snapper at one of Cap Cana's marina restaurants. Or a casual Dominican "bandera" (rice, beans, and meat) at a local spot. The dining scene ranges from Michelin-quality to authentic roadside stands.

**3:00 PM — The Productive Hours**

Many residents are remote workers, entrepreneurs, or retirees who invest a few afternoon hours in projects or business. High-speed fiber internet is now standard in most luxury communities. Co-working spaces are opening across the area.

**5:30 PM — Pool & Sunset**

This is the magic hour. Infinity pools overlooking the Caribbean. A glass of local Brugal rum or Dominican craft beer. The sunsets in Punta Cana are genuinely spectacular — vivid oranges and purples that never get old.

**7:30 PM — Dinner & Social**

The dining options range from world-class resort restaurants to hidden gems. Cap Cana's marina village offers upscale dining, while Bávaro's Los Corales strip has everything from sushi to steakhouses. Social life is easy — the expat community is welcoming and active.

**The Practical Side**

- **Healthcare**: Modern hospitals and clinics with English-speaking staff
- **Shopping**: Blue Mall and Downtown Punta Cana for modern retail
- **Schools**: International schools offering American and European curricula
- **Safety**: Gated communities with 24/7 security
- **Transportation**: Punta Cana International Airport connects to 120+ cities worldwide

**The Verdict**

Living in Punta Cana isn't just a vacation — it's a genuine lifestyle upgrade. Lower cost of living, world-class amenities, year-round warmth, and a community of like-minded international residents.`,
        content_es: `Olvídate de los folletos turísticos. Así se siente realmente vivir en Punta Cana a tiempo completo — basado en conversaciones con nuestros clientes propietarios que hicieron el cambio.

**6:30 AM — Mañana en la Playa**

El día comienza temprano en el Caribe. Muchos propietarios en Cap Cana y Bávaro empiezan con un paseo al amanecer por Playa Juanillo o Playa Bávaro.

**10:00 AM — Golf o Deportes Acuáticos**

Con más de 10 campos de campeonato en un radio de 30 minutos, el golf es un ritual diario. El campo Punta Espada en Cap Cana está clasificado #1 en el Caribe.

**12:30 PM — Almuerzo Al Aire Libre**

Langosta fresca, mahi-mahi o pargo rojo en uno de los restaurantes de la marina de Cap Cana. O una "bandera" dominicana casual.

**5:30 PM — Piscina y Atardecer**

Esta es la hora mágica. Piscinas infinitas con vista al Caribe. Los atardeceres en Punta Cana son genuinamente espectaculares.

**El Lado Práctico**

- **Salud**: Hospitales modernos con personal de habla inglesa
- **Compras**: Blue Mall y Downtown Punta Cana
- **Escuelas**: Escuelas internacionales con currículos americanos y europeos
- **Seguridad**: Comunidades cerradas con seguridad 24/7

**El Veredicto**

Vivir en Punta Cana no es solo unas vacaciones — es una mejora genuina del estilo de vida.`,
        coverImage: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1200',
        author: 'LASS Realty Team',
        category: 'lifestyle',
        publishedAt: new Date('2026-01-20'),
        featured: false,
    },
];

// ═══════════════════════════════════════════════════════
//  NEIGHBORHOOD GUIDES
// ═══════════════════════════════════════════════════════
const neighborhoods = [
    {
        name: 'Cap Cana',
        name_es: 'Cap Cana',
        slug: 'cap-cana',
        description: `Cap Cana is the crown jewel of Dominican Republic luxury real estate. This exclusive, gated resort community spans over 30,000 acres along the southeastern coast and is home to some of the most prestigious addresses in the Caribbean.

The centerpiece is the Jack Nicklaus-designed Punta Espada Golf Course — consistently ranked #1 in the Caribbean and Mexico. Alongside championship golf, residents enjoy a full-service marina, pristine Juanillo Beach, world-class restaurants, and seamless connectivity through Punta Cana International Airport just 15 minutes away.

Real estate in Cap Cana ranges from luxury oceanfront condominiums starting at $350,000 to mega-villas exceeding $10 million. The development contains branded residences, boutique hotels, and resort-style communities that attract high-net-worth individuals from around the globe.

Investment potential is strong: Cap Cana properties have seen steady appreciation, and weekly luxury rentals targeting golf tourism and affluent families generate estimated net yields of 7-9%.`,
        description_es: `Cap Cana es la joya de la corona del mercado inmobiliario de lujo en República Dominicana. Esta exclusiva comunidad cerrada abarca más de 30,000 acres a lo largo de la costa sureste y alberga algunas de las direcciones más prestigiosas del Caribe.

La pieza central es el campo de golf Punta Espada, diseñado por Jack Nicklaus — consistentemente clasificado #1 en el Caribe y México. Los residentes disfrutan de una marina de servicio completo, la prístina Playa Juanillo, restaurantes de clase mundial y conectividad directa al Aeropuerto Internacional de Punta Cana a solo 15 minutos.

Los bienes raíces en Cap Cana van desde condominios de lujo frente al mar desde $350,000 hasta mega-villas que superan los $10 millones. El desarrollo contiene residencias de marca, hoteles boutique y comunidades estilo resort.

El potencial de inversión es fuerte: las propiedades de Cap Cana han visto apreciación constante, con rendimientos netos estimados del 7-9%.`,
        heroImage: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=1600',
        gallery: [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
        ],
        highlights: [
            'Jack Nicklaus Punta Espada Golf — #1 in Caribbean',
            'Full-service marina & yacht club',
            'Pristine Juanillo Beach — private access',
            '15 min to Punta Cana International Airport',
            'Branded residences & 5-star resort amenities',
            'Gated security with 24/7 patrol',
            'Fine dining at Cap Cana Marina Village',
            'Estimated rental yields: 7-9%',
        ],
        highlights_es: [
            'Golf Punta Espada de Jack Nicklaus — #1 en el Caribe',
            'Marina de servicio completo y club de yates',
            'Prístina Playa Juanillo — acceso privado',
            '15 min al Aeropuerto Internacional de Punta Cana',
            'Residencias de marca y amenidades 5 estrellas',
            'Seguridad cerrada con patrulla 24/7',
            'Gastronomía fina en Marina Village de Cap Cana',
            'Rendimientos de alquiler estimados: 7-9%',
        ],
        mapCoordinates: { lat: 18.4467, lng: -68.3967 },
        averagePrice: 850000,
    },
    {
        name: 'Bávaro',
        name_es: 'Bávaro',
        slug: 'bavaro',
        description: `Bávaro is the vibrant heart of Punta Cana's tourism and real estate boom. Home to the world-famous Playa Bávaro — consistently named one of the best beaches on Earth — this dynamic area combines beachfront living with modern convenience.

The Los Corales district is Punta Cana's highest-performing Airbnb market, attracting snowbirds, digital nomads, and tourists year-round. Properties here generate some of the highest rental yields in the Caribbean at 9-11% net.

Bávaro offers an incredibly diverse range of properties: from modern beachfront condos starting at $120,000 to luxury villas in gated communities. The area has seen rapid infrastructure development, including new shopping centers, international restaurants, hospitals, and schools.

For investors seeking maximum rental income with a relatively affordable entry point, Bávaro is the clear winner. The combination of beach proximity, tourist traffic, and growing local amenities makes it the most in-demand neighborhood in Punta Cana.`,
        description_es: `Bávaro es el vibrante corazón del auge turístico e inmobiliario de Punta Cana. Hogar de la mundialmente famosa Playa Bávaro — consistentemente nombrada como una de las mejores playas del mundo — esta dinámica área combina vida frente a la playa con conveniencia moderna.

El distrito Los Corales es el mercado de Airbnb de mayor rendimiento en Punta Cana, atrayendo nómadas digitales y turistas durante todo el año. Las propiedades aquí generan algunos de los mayores rendimientos de alquiler del Caribe, con un 9-11% neto.

Bávaro ofrece una gama increíblemente diversa de propiedades: desde condominios modernos frente a la playa desde $120,000 hasta villas de lujo en comunidades cerradas.

Para inversionistas que buscan máximo ingreso de alquiler con un punto de entrada relativamente asequible, Bávaro es el claro ganador.`,
        heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1600',
        gallery: [
            'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
        ],
        highlights: [
            'Playa Bávaro — ranked top 10 beaches worldwide',
            'Highest Airbnb yields in the Caribbean (9-11%)',
            'Los Corales — walkable beach district',
            'Growing dining & nightlife scene',
            'New hospitals & international schools',
            'Blue Mall & Downtown Punta Cana nearby',
            'Properties from $120K — lowest entry point',
            '20 min to Punta Cana International Airport',
        ],
        highlights_es: [
            'Playa Bávaro — clasificada entre las 10 mejores del mundo',
            'Mayor rendimiento Airbnb del Caribe (9-11%)',
            'Los Corales — distrito playero peatonal',
            'Creciente escena gastronómica y de vida nocturna',
            'Nuevos hospitales y escuelas internacionales',
            'Blue Mall y Downtown Punta Cana cerca',
            'Propiedades desde $120K — punto de entrada más bajo',
            '20 min al Aeropuerto Internacional de Punta Cana',
        ],
        mapCoordinates: { lat: 18.6891, lng: -68.4458 },
        averagePrice: 285000,
    },
    {
        name: 'Cocotal Golf & Country Club',
        name_es: 'Cocotal Golf & Country Club',
        slug: 'cocotal',
        description: `Cocotal Golf & Country Club is one of Punta Cana's most prestigious gated communities, built around a stunning 27-hole championship golf course designed by José "Pepe" Gancedo. Located in the Bávaro area, it offers the perfect balance of luxury living, resort amenities, and investment potential.

The community features an array of elegant properties — from golf-course villas with panoramic fairway views to modern apartments surrounding the clubhouse. The landscaping throughout Cocotal is meticulously maintained, creating a serene, park-like environment.

Residents enjoy world-class amenities: a full-service clubhouse with restaurants and bars, multiple swimming pools, tennis courts, paddle courts, a fitness center, and tranquil walking paths through tropical gardens. Property owners receive discounted golf rates and exclusive access to private beach clubs at nearby Meliá resorts.

Cocotal is especially popular with retirees and families seeking a safe, quiet environment with resort-quality infrastructure. The combination of security, elegance, and strong appreciation makes it one of the most consistently desirable addresses in Punta Cana.`,
        description_es: `Cocotal Golf & Country Club es una de las comunidades cerradas más prestigiosas de Punta Cana, construida alrededor de un impresionante campo de golf de 27 hoyos diseñado por José "Pepe" Gancedo. Ubicado en el área de Bávaro, ofrece el equilibrio perfecto entre vida de lujo, amenidades resort e inversión.

La comunidad cuenta con una variedad de propiedades elegantes — desde villas con vistas panorámicas del campo de golf hasta apartamentos modernos. El paisajismo es meticulosamente mantenido, creando un ambiente sereno.

Los residentes disfrutan de amenidades de clase mundial: clubhouse con restaurantes, piscinas, canchas de tenis, gimnasio y senderos para caminar por jardines tropicales. Los propietarios reciben descuentos en golf y acceso exclusivo a clubes de playa en resorts Meliá cercanos.

Cocotal es especialmente popular entre jubilados y familias que buscan un ambiente seguro con infraestructura de calidad resort.`,
        heroImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=1600',
        gallery: [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
        ],
        highlights: [
            '27-hole championship golf by José Gancedo',
            'Exclusive gated community with 24/7 security',
            'Clubhouse with restaurants, pools & tennis',
            'Discounted golf for property owners',
            'Private beach club at Meliá resort',
            'Tranquil walking paths & tropical gardens',
            'Family-friendly & retiree-favorite',
            'Strong long-term property appreciation',
        ],
        highlights_es: [
            'Campo de golf de 27 hoyos por José Gancedo',
            'Comunidad cerrada exclusiva con seguridad 24/7',
            'Clubhouse con restaurantes, piscinas y tenis',
            'Golf con descuento para propietarios',
            'Club de playa privado en resort Meliá',
            'Senderos tranquilos y jardines tropicales',
            'Ideal para familias y jubilados',
            'Fuerte apreciación a largo plazo',
        ],
        mapCoordinates: { lat: 18.6700, lng: -68.4100 },
        averagePrice: 320000,
    },
    {
        name: 'Downtown Punta Cana',
        name_es: 'Downtown Punta Cana',
        slug: 'downtown-punta-cana',
        description: `Downtown Punta Cana is the region's emerging urban center — a modern, walkable district designed to serve the growing local and expat community. Unlike the resort-centric areas, Downtown offers a more urban lifestyle with shopping, dining, entertainment, and business facilities all in one place.

Anchored by the Blue Mall shopping center and surrounded by new residential developments, Downtown Punta Cana is rapidly becoming the go-to address for professionals, entrepreneurs, and investors who want to be at the center of the action.

Properties here are among the most affordable in the Punta Cana ecosystem, with condos starting around $80,000-$200,000. Rental demand comes from a different segment than the beach areas: business travelers, local professionals, and expats who want convenience over beachfront.

The area has seen significant infrastructure investment, including new roads, a modern hospital, international schools, coworking spaces, and a growing selection of restaurants and nightlife. For investors seeking steady, year-round occupancy from non-tourism tenants, Downtown offers 6-8% net yields with lower vacancy risk.`,
        description_es: `Downtown Punta Cana es el centro urbano emergente de la región — un distrito moderno y peatonal diseñado para servir a la creciente comunidad local y expatriada. A diferencia de las áreas centradas en resorts, Downtown ofrece un estilo de vida más urbano.

Anclado por el centro comercial Blue Mall y rodeado de nuevos desarrollos residenciales, Downtown Punta Cana se está convirtiendo rápidamente en la dirección preferida para profesionales, empresarios e inversionistas.

Las propiedades son de las más accesibles del ecosistema de Punta Cana, con condominios desde $80,000-$200,000. La demanda de alquiler proviene de viajeros de negocios, profesionales locales y expatriados.

Para inversionistas que buscan ocupación estable durante todo el año, Downtown ofrece rendimientos netos del 6-8% con menor riesgo de vacancia.`,
        heroImage: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=1600',
        gallery: [
            'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
        ],
        highlights: [
            'Blue Mall — modern shopping & dining hub',
            'Most affordable entry point ($80K-$200K)',
            'Year-round rental demand from professionals',
            'Growing coworking & startup scene',
            'Modern hospital & medical facilities',
            'International schools nearby',
            'New roads & infrastructure investment',
            '6-8% net rental yields',
        ],
        highlights_es: [
            'Blue Mall — centro de compras y gastronomía moderno',
            'Punto de entrada más accesible ($80K-$200K)',
            'Demanda de alquiler durante todo el año',
            'Creciente escena de coworking y startups',
            'Hospital moderno e instalaciones médicas',
            'Escuelas internacionales cerca',
            'Nuevas carreteras e inversión en infraestructura',
            'Rendimientos netos de alquiler del 6-8%',
        ],
        mapCoordinates: { lat: 18.5820, lng: -68.4055 },
        averagePrice: 155000,
    },
    {
        name: 'Vista Cana',
        name_es: 'Vista Cana',
        slug: 'vista-cana',
        description: `Vista Cana is Punta Cana's fastest-growing residential community and the area's best-kept secret for smart investors. Located along the main highway connecting Punta Cana to Santo Domingo, Vista Cana offers a master-planned environment with modern infrastructure, green spaces, and a more tranquil alternative to the bustling beach zones.

What sets Vista Cana apart is its appeal to long-stay renters and digital nomads. With high-speed fiber internet, new commercial plazas, and a growing community of remote workers, the area has carved out a unique niche. Occupancy rates are among the highest in the region (80-88%) because tenants tend to stay for months or even years rather than short vacation stays.

Properties in Vista Cana range from $100,000 to $250,000, making it one of the most accessible investments in the Punta Cana corridor. The community features parks, walking trails, sports facilities, and is within driving distance of both Punta Cana's beaches and the interior highlands.

For investors with a longer time horizon, Vista Cana represents strong appreciation potential. The area is still in its growth phase, meaning current buyers benefit from lower entry prices before the neighborhood fully matures.`,
        description_es: `Vista Cana es la comunidad residencial de más rápido crecimiento de Punta Cana y el secreto mejor guardado del área para inversionistas inteligentes. Ubicado a lo largo de la autopista principal que conecta Punta Cana con Santo Domingo, ofrece un ambiente planificado con infraestructura moderna y espacios verdes.

Lo que distingue a Vista Cana es su atractivo para inquilinos de larga estadía y nómadas digitales. Con internet de fibra de alta velocidad y una creciente comunidad de trabajadores remotos, el área ha creado un nicho único. Las tasas de ocupación están entre las más altas de la región (80-88%).

Las propiedades van desde $100,000 hasta $250,000, siendo una de las inversiones más accesibles en el corredor de Punta Cana. La comunidad cuenta con parques, senderos, instalaciones deportivas y está a poca distancia de las playas.

Para inversionistas con un horizonte de tiempo más largo, Vista Cana representa un fuerte potencial de apreciación.`,
        heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600',
        gallery: [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
        ],
        highlights: [
            'Fastest-growing community in Punta Cana',
            'Digital nomad & remote worker hub',
            'Highest occupancy rates (80-88%)',
            'Affordable entry: $100K-$250K',
            'High-speed fiber internet throughout',
            'Master-planned parks & green spaces',
            'Strong long-term appreciation potential',
            'Connected to Santo Domingo highway',
        ],
        highlights_es: [
            'Comunidad de más rápido crecimiento en Punta Cana',
            'Centro para nómadas digitales y trabajadores remotos',
            'Tasas de ocupación más altas (80-88%)',
            'Entrada accesible: $100K-$250K',
            'Internet de fibra de alta velocidad en toda la zona',
            'Parques y espacios verdes planificados',
            'Fuerte potencial de apreciación a largo plazo',
            'Conectado a la autopista de Santo Domingo',
        ],
        mapCoordinates: { lat: 18.5300, lng: -68.5600 },
        averagePrice: 165000,
    },
];

// ═══════════════════════════════════════════════════════
//  SEED DATABASE
// ═══════════════════════════════════════════════════════
console.log('\n📝 Seeding Blog Posts...');
for (const post of blogPosts) {
    try {
        await Post.findOneAndUpdate({ slug: post.slug }, post, { upsert: true, new: true });
        console.log(`  ✅ ${post.title}`);
    } catch (e) {
        console.error(`  ❌ Failed: ${post.title}`, e.message);
    }
}

console.log('\n🏘️  Seeding Neighborhoods...');
for (const n of neighborhoods) {
    try {
        await Neighborhood.findOneAndUpdate({ slug: n.slug }, n, { upsert: true, new: true });
        console.log(`  ✅ ${n.name}`);
    } catch (e) {
        console.error(`  ❌ Failed: ${n.name}`, e.message);
    }
}

console.log('\n✨ Seeding complete!');
await mongoose.disconnect();
process.exit(0);
