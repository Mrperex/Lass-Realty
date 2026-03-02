import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

const propertySchema = new mongoose.Schema({
    city: String,
    citySlug: String
}, { strict: false });

const Property = mongoose.model('Property', propertySchema);

async function run() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('Fetching properties...');
    const props = await Property.find({});
    let count = 0;
    for (const p of props) {
        if (p.city && !p.citySlug) {
            p.citySlug = p.city.toLowerCase().replace(/\s+/g, '-');
            await p.save();
            console.log(`Updated ${p.city} -> ${p.citySlug}`);
            count++;
        }
    }
    console.log(`Done. Migrated ${count} properties.`);
    process.exit(0);
}

run().catch(console.error);
