
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb+srv://pablopok08_db_user:kbBT9GMLRGv4KnT5@cluster0.3hbnbcb.mongodb.net/?appName=Cluster0';

// Mock the model and find logic
async function simulateFetch(city) {
    try {
        console.log(`Connecting for city: ${city}...`);
        await mongoose.connect(MONGODB_URI);
        const db = mongoose.connection.db;
        
        const properties = await db.collection('properties').find({ citySlug: city }).toArray();
        console.log(`Found ${properties.length} properties`);
        
        // Simulate the map logic in the component
        const availableBeds = Array.from(new Set(properties.map(p => p.bedrooms))).sort((a, b) => a - b);
        console.log('Available beds:', availableBeds);
        
        process.exit(0);
    } catch (err) {
        console.error('Simulation failed:', err);
        process.exit(1);
    }
}

const city = process.argv[2] || 'punta-cana';
simulateFetch(city);
