import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

const propertySchema = new mongoose.Schema({
    title: String,
    slug: String,
    description: String,
    price: Number,
    city: String,
    citySlug: String,
    bedrooms: Number,
    bathrooms: Number,
    squareMeters: Number,
    status: String,
    featured: Boolean,
    images: [String]
}, { strict: false, timestamps: true });

const Property = mongoose.model('PropertySeed', propertySchema, 'properties');

const LOCATIONS = [
    { name: 'Punta Cana', slug: 'punta-cana' },
    { name: 'Cap Cana', slug: 'cap-cana' },
    { name: 'Bavaro', slug: 'bavaro' },
    { name: 'Macao', slug: 'macao' }
];

const ADJECTIVES = ['Modern', 'Luxury', 'Contemporary', 'Exclusive', 'Stunning', 'Beautiful', 'Spacious', 'Oceanfront', 'Tropical', 'Premium'];
const TYPES = ['Villa', 'Condo', 'Penthouse', 'Residence', 'Estate', 'Retreat'];

const AMENITIES_DESC = [
    "Features include a private infinity pool, massive outdoor entertaining areas, and custom European cabinetry.",
    "Enjoy resort-style living with exclusive access to the beach club, golf course, and private marina.",
    "This meticulously designed property offers open-concept living, smart home features, and unparalleled views.",
    "Boasting floor-to-ceiling windows, high-end stainless steel appliances, and a lush landscaped garden.",
    "A rare opportunity to own a piece of paradise, complete with a rooftop terrace and 24/7 concierge security."
];

// High quality unsplash placeholders relevant to tropical real estate
const IMAGE_POOLS = [
    'https://images.unsplash.com/photo-1613490908578-15c13b28b615?q=80&w=2670&auto=format&fit=crop', // luxury exterior pool
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2675&auto=format&fit=crop', // modern house
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop', // beautiful contemporary
    'https://images.unsplash.com/photo-1600607687920-4e2a09be1587?q=80&w=2670&auto=format&fit=crop', // nice living room
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop', // modern living area
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2670&auto=format&fit=crop', // kitchen
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2670&auto=format&fit=crop', // cozy living room
    'https://images.unsplash.com/photo-1574362848149-114962eb0463?q=80&w=2670&auto=format&fit=crop', // patio view
    'https://images.unsplash.com/photo-1502672260266-1c1de242488a?q=80&w=2670&auto=format&fit=crop', // interior bedroom
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=2670&auto=format&fit=crop'  // luxury bedroom
];

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateProperty() {
    const location = getRandomItem(LOCATIONS);
    const adj = getRandomItem(ADJECTIVES);
    const type = getRandomItem(TYPES);
    const title = `${adj} ${type} in ${location.name}`;

    // Create highly unique slug to avoid collisions
    const uniqueId = Math.random().toString(36).substring(2, 6);
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${uniqueId}`;

    // 60% chance for a villa/estate (expensive), 40% for condo (cheaper)
    const isLuxury = type === 'Villa' || type === 'Estate' || type === 'Penthouse';

    const price = isLuxury ? getRandomInt(800, 3500) * 1000 : getRandomInt(200, 750) * 1000;
    const bedrooms = isLuxury ? getRandomInt(3, 6) : getRandomInt(1, 3);
    const bathrooms = bedrooms + (Math.random() > 0.5 ? 0.5 : 0);
    const squareMeters = isLuxury ? getRandomInt(250, 800) : getRandomInt(80, 200);

    // Pick 3-5 random images for the gallery
    const imageCount = getRandomInt(3, 5);
    const shuffledImages = [...IMAGE_POOLS].sort(() => 0.5 - Math.random());
    const images = shuffledImages.slice(0, imageCount);

    const description = `This exceptional ${title.toLowerCase()} presents a unique opportunity in the highly sought-after area of ${location.name}. Designed with meticulous attention to detail, this residence offers ${squareMeters} square meters of living space, featuring ${bedrooms} elegant bedrooms and ${bathrooms} bathrooms.\n\n${getRandomItem(AMENITIES_DESC)}\n\nDon't miss the chance to experience luxury Caribbean living at its finest.`;

    return {
        title,
        slug,
        description,
        price,
        city: location.name,
        citySlug: location.slug,
        bedrooms,
        bathrooms,
        squareMeters,
        status: Math.random() > 0.1 ? 'for-sale' : 'reserved', // 10% reserved
        featured: Math.random() > 0.8, // 20% featured
        images
    };
}

async function run() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);

    console.log('Generating 30 high-fidelity mock properties...');
    const properties = [];
    for (let i = 0; i < 30; i++) {
        properties.push(generateProperty());
    }

    await Property.insertMany(properties);
    console.log('Successfully seeded 30 properties.');

    process.exit(0);
}

run().catch(console.error);
