import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const propertySchema = new mongoose.Schema({
    city: String,
    citySlug: String
}, { strict: false });

const Property = mongoose.model('Property', propertySchema);

async function run() {
    await mongoose.connect(MONGODB_URI!);
    const props = await Property.find({});
    for (const p of props) {
        if (p.city && !p.citySlug) {
            p.citySlug = p.city.toLowerCase().replace(/\s+/g, '-');
            await p.save();
            console.log(`Updated ${p.city} -> ${p.citySlug}`);
        }
    }
    console.log('Done');
    process.exit(0);
}

run();
