require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

// Define the Property schema inline
const PropertySchema = new mongoose.Schema({
    title: String,
    slug: String,
    price: Number,
    published: Boolean,
    featured: Boolean,
    // Add other fields as needed
}, { timestamps: true });

const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

async function updateFeaturedProperties() {
    try {
        // Connect to MongoDB
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI not found in environment variables');
        }
        
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Update all published properties to have featured: true
        const result = await Property.updateMany(
            { published: true, featured: { $ne: true } },
            { $set: { featured: true } }
        );

        console.log(`Updated ${result.modifiedCount} properties to featured: true`);

        // Verify the update
        const featuredCount = await Property.countDocuments({ featured: true });
        console.log(`Total featured properties: ${featuredCount}`);

        // List some featured properties
        const featuredProps = await Property.find(
            { featured: true },
            { title: 1, slug: 1, price: 1 }
        ).limit(3).lean();
        
        console.log('Featured properties:');
        featuredProps.forEach(p => {
            console.log(`- ${p.title}: $${p.price?.toLocaleString()}`);
        });

        // Close connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error updating featured properties:', error);
        process.exit(1);
    }
}

updateFeaturedProperties();
