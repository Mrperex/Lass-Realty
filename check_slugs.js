const mongoose = require('mongoose');

async function checkSlugs() {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://pabloperezbrito:NnixvP3nO2G3q2yE@lassrealty.y9c0k.mongodb.net/lass-realty-prod?retryWrites=true&w=majority&appName=lassrealty");
    const db = mongoose.connection.db;
    const slugs = await db.collection('properties').distinct('citySlug');
    console.log("Distinct citySlugs in DB properties:", slugs);
    process.exit(0);
}

checkSlugs();
