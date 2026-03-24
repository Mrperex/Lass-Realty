require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

// Define the Property schema inline
const PropertySchema = new mongoose.Schema({
    title: String,
    slug: String,
    price: Number,
    published: Boolean,
    featured: Boolean,
    status: String,
    createdAt: Date
}, { timestamps: true });

const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

async function checkProductionData() {
    try {
        // Connect to MongoDB
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI not found in environment variables');
        }
        
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check total properties
        const totalProps = await Property.countDocuments();
        console.log(`Total properties in database: ${totalProps}`);

        // Check published properties
        const publishedProps = await Property.countDocuments({ published: true });
        console.log(`Published properties: ${publishedProps}`);

        // Check featured properties
        const featuredProps = await Property.countDocuments({ featured: true });
        console.log(`Featured properties: ${featuredProps}`);

        // Check published AND featured
        const publishedFeatured = await Property.countDocuments({ 
            published: true, 
            featured: true 
        });
        console.log(`Published AND featured properties: ${publishedFeatured}`);

        // Update all properties to be published
        const updateResult = await Property.updateMany(
            { published: { $ne: true } },
            { $set: { published: true } }
        );
        console.log(`\nUpdated ${updateResult.modifiedCount} properties to published: true`);

        // Check again
        const properties = await Property.find({ 
            published: true, 
            featured: true 
        })
        .select('title slug price featured published status createdAt')
        .limit(3)
        .lean();
        
        console.log('\nSample properties:');
        properties.forEach(p => {
            console.log(`- ${p.title}`);
            console.log(`  Slug: ${p.slug}`);
            console.log(`  Price: $${p.price?.toLocaleString()}`);
            console.log(`  Published: ${p.published}`);
            console.log(`  Featured: ${p.featured}`);
            console.log(`  Status: ${p.status}`);
            console.log(`  Created: ${p.createdAt}`);
            console.log('');
        });

        // Close connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error checking production data:', error);
        process.exit(1);
    }
}

checkProductionData();
