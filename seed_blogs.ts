import { connect } from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Setup a simple mongoose connection and schema since ts-node might struggle with Next.js path aliases
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, required: true },
    category: { type: String, required: true },
    tags: [String],
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    metaDescription: String,
    metaKeywords: [String],

    // Explicit multi-language fields
    title_es: String,
    excerpt_es: String,
    content_es: String,

    title_fr: String,
    excerpt_fr: String,
    content_fr: String,
});

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

const blogs = [
    {
        title: "Maximizing ROI with Airbnb Rentals in Punta Cana",
        slug: "airbnb-rental-roi-punta-cana",
        excerpt: "Discover the secrets to generating high yields with short-term vacation rentals in the Dominican Republic's top tourist destination.",
        content: `
            <h2>The Boom of Short-Term Rentals in Punta Cana</h2>
            <p>Punta Cana is not just a paradise for vacationers; it's a goldmine for real estate investors. With millions of tourists visiting year-round, the demand for Airbnb and VRBO properties has skyrocketed.</p>
            <h3>Why Punta Cana?</h3>
            <p>The region offers consistent warm weather, world-class beaches, and a booming infrastructure. Properties located near the beach or within luxury communities like Cap Cana enjoy occupancy rates upwards of 70%.</p>
            <h3>Tips for Maximizing Your ROI</h3>
            <ul>
                <li><strong>Location is Key:</strong> Properties within walking distance to the beach or major amenities rent faster.</li>
                <li><strong>Professional Photography:</strong> High-quality images make your listing stand out.</li>
                <li><strong>Exceptional Management:</strong> Partnering with a reputable property management company ensures your guests have a 5-star experience while giving you peace of mind.</li>
            </ul>
            <p>Investing in a vacation rental here is a proven wealth-building strategy. Contact LASS Realty to explore high-yield properties.</p>
        `,
        coverImage: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80",
        category: "Investment",
        tags: ["Airbnb", "ROI", "Investment", "Punta Cana"],
        isPublished: true,
        publishedAt: new Date(),
        title_es: "Maximizando el ROI con Alquileres de Airbnb en Punta Cana",
        excerpt_es: "Descubra los secretos para generar altos rendimientos con alquileres vacacionales a corto plazo en Punta Cana.",
        content_es: "El mercado de alquiler a corto plazo en Punta Cana está en auge. Con tasas de ocupación superiores al 70% en zonas premium, es una inversión segura. Asegúrate de tener una buena ubicación y administración profesional.",
    },
    {
        title: "The Ultimate Guide to Long-Term Rentals in the Dominican Republic",
        slug: "guide-long-term-rentals-dr",
        excerpt: "Everything expats and remote workers need to know about finding and securing a long-term rental in paradise.",
        content: `
            <h2>Embracing the Tropics Full-Time</h2>
            <p>More digital nomads, retirees, and expats are choosing to make the Dominican Republic their home. Long-term rentals offer stability and a chance to truly immerse yourself in the culture.</p>
            <h3>What to Expect</h3>
            <p>Long-term leases in the DR are typically 6 to 12 months. Most luxury condos and villas come fully furnished, often including amenities like internet, maintenance, and water in the monthly rent. Electricity is usually billed separately.</p>
            <h3>Top Areas for Long-Term Living</h3>
            <ul>
                <li><strong>Punta Cana Village:</strong> Family-friendly, close to schools and the airport.</li>
                <li><strong>Bavaro:</strong> Bustling with nightlife, restaurants, and close to the beach.</li>
                <li><strong>Cap Cana:</strong> Exclusive, secure, and luxurious.</li>
            </ul>
            <p>Working with a specialized agency like LASS Realty ensures you find a property with a fair contract and reliable landlord. We help you navigate the legalities of leasing as a foreigner.</p>
        `,
        coverImage: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80",
        category: "Living",
        tags: ["Expats", "Long Term", "Rentals", "Living"],
        isPublished: true,
        publishedAt: new Date(),
        title_es: "Guía Definitiva para Alquileres a Largo Plazo en la RD",
        excerpt_es: "Todo lo que los expatriados deben saber para encontrar un alquiler a largo plazo en el paraíso.",
        content_es: "Los alquileres a largo plazo (6 a 12 meses) ofrecen estabilidad. Zonas como Punta Cana Village y Cap Cana son ideales. LASS Realty puede ayudarte a navegar los contratos y encontrar el lugar perfecto.",
    },
    {
        title: "Best Law Firms for Real Estate Transactions in the DR",
        slug: "best-real-estate-law-firms-dr",
        excerpt: "Ensure a safe and secure property purchase. A curated list of the top trusted legal partners in the Dominican Republic.",
        content: `
            <h2>Navigating the Legal Landscape</h2>
            <p>Purchasing real estate in a foreign country can be daunting. The Dominican Republic has a modern and secure real estate registry system, but hiring a competent local attorney is absolutely crucial.</p>
            <h3>Why You Need a Local Attorney</h3>
            <p>A good lawyer will perform due diligence, verify the property's Title (Titulo), check for liens, and ensure the seller is in good standing with the tax authorities (DGII).</p>
            <h3>Top Recommended Law Firms</h3>
            <p>At LASS Realty, we only recommend firms with a proven track record of protecting foreign investors:</p>
            <ul>
                <li><strong>Guzman Ariza:</strong> The largest law firm in the country with extensive experience in real estate and foreign investment.</li>
                <li><strong>Heinsen & Co:</strong> Known for their personalized service and expertise in Punta Cana real estate transactions.</li>
                <li><strong>Castillo y Castillo:</strong> A prestigious firm offering comprehensive legal services for large-scale investments.</li>
            </ul>
            <p>Always insist on independent counsel. LASS Realty works seamlessly with these firms to guarantee your transaction is 100% secure.</p>
        `,
        coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80",
        category: "Legal",
        tags: ["Legal", "Law Firms", "Buying Process", "Advice"],
        isPublished: true,
        publishedAt: new Date(),
        title_es: "Las Mejores Firmas de Abogados para Bienes Raíces en RD",
        excerpt_es: "Garantice una compra segura. Una lista curada de los principales socios legales de confianza en la República Dominicana.",
        content_es: "Comprar bienes raíces requiere un abogado local competente para la debida diligencia. Recomendamos firmas como Guzman Ariza y Castillo y Castillo para proteger su inversión extranjera.",
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected to MongoDB');

        // Upsert based on slug
        for (const blog of blogs) {
            await Post.findOneAndUpdate({ slug: blog.slug }, blog, { upsert: true, new: true });
            console.log("✅ Inserted/Updated blog: " + blog.title);
        }

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
