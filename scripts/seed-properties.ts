import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Simple version of the model to avoid Next.js imports in script
const PropertySchema = new mongoose.Schema({
    title: String,
    slug: String,
    description: String,
    price: Number,
    city: String,
    bedrooms: Number,
    bathrooms: Number,
    images: [String],
    featured: Boolean,
});

const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

const sampleProperties = [
    {
        title: 'Modern Beachfront Villa',
        slug: 'modern-beachfront-villa',
        description: 'Stunning modern villa with direct beach access, infinity pool, and panoramic ocean views in the heart of Punta Cana.',
        price: 3500000,
        city: 'Punta Cana',
        bedrooms: 5,
        bathrooms: 6,
        images: ['https://images.unsplash.com/photo-1613490908571-9ce224a0d923?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'],
        featured: true,
    },
    {
        title: 'Luxury Golf Course Estate',
        slug: 'luxury-golf-course-estate',
        description: 'Exclusive estate overlooking the 18th hole of a championship golf course. Features home theater, wine cellar, and guest house.',
        price: 2850000,
        city: 'Cap Cana',
        bedrooms: 6,
        bathrooms: 7,
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'],
        featured: true,
    },
    {
        title: 'Oceanview Penthouse Condo',
        slug: 'oceanview-penthouse-condo',
        description: 'Luxurious penthouse with private rooftop terrace, jacuzzi, and unobstructed views of the Caribbean Sea.',
        price: 1200000,
        city: 'Bavaro',
        bedrooms: 3,
        bathrooms: 3.5,
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'],
        featured: true,
    },
    {
        title: 'Contemporary Jungle Villa',
        slug: 'contemporary-jungle-villa',
        description: 'Architectural masterpiece surrounded by lush tropical vegetation. Ultimate privacy with modern amenities.',
        price: 1850000,
        city: 'Macao',
        bedrooms: 4,
        bathrooms: 4.5,
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'],
        featured: false,
    },
    {
        title: 'Marina Front Residence',
        slug: 'marina-front-residence',
        description: 'Elegant home with private boat dock in an exclusive marina community. Perfect for yachting enthusiasts.',
        price: 4200000,
        city: 'Cap Cana',
        bedrooms: 5,
        bathrooms: 6,
        images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'],
        featured: false,
    },
];

async function seed() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI is missing. Please make sure .env.local exists from the root directory.');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        // Clear existing
        await Property.deleteMany({});
        console.log('Cleared existing properties');

        // Insert new
        await Property.insertMany(sampleProperties);
        console.log(`Inserted ${sampleProperties.length} properties`);

        console.log('Seeding complete!');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

seed();
