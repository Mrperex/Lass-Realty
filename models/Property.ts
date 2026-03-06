import mongoose, { Schema, model, models } from 'mongoose';
import { IProperty } from '@/types/property';
import './Agent'; // Ensure Agent model is registered

const PropertySchema = new Schema<IProperty>(
    {
        title: { type: String, required: true },
        title_es: { type: String },
        title_fr: { type: String },
        title_it: { type: String },
        title_de: { type: String },
        title_ru: { type: String },
        title_ht: { type: String },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        description_es: { type: String },
        description_fr: { type: String },
        description_it: { type: String },
        description_de: { type: String },
        description_ru: { type: String },
        description_ht: { type: String },
        price: { type: Number, required: true },
        city: { type: String, required: true },
        city_es: { type: String },
        city_fr: { type: String },
        city_it: { type: String },
        city_de: { type: String },
        city_ru: { type: String },
        city_ht: { type: String },
        citySlug: { type: String, required: true },
        bedrooms: { type: Number, required: true },
        bathrooms: { type: Number, required: true },
        squareMeters: { type: Number, required: true },
        images: { type: [String], required: true },
        featured: { type: Boolean, default: false },
        status: { type: String, enum: ['for-sale', 'sold', 'reserved', 'for-rent', 'rented'], default: 'for-sale' },
        deposit: { type: Number },
        maintenanceFee: { type: Number },
        rentPeriod: { type: String, enum: ['monthly', 'nightly'] },
        pool: { type: Boolean, default: false },
        oceanView: { type: Boolean, default: false },
        golfView: { type: Boolean, default: false },
        furnished: { type: Boolean, default: false },
        petFriendly: { type: Boolean, default: false },
        amenities: { type: [String], default: [] },
        type: { type: String, enum: ['villa', 'condo', 'penthouse', 'land'] },
        virtualTourUrl: { type: String },
        videoTourUrl: { type: String },
        floorPlans: { type: [String], default: [] },
        priceHistory: [{
            date: { type: Date, required: true },
            price: { type: Number, required: true },
            event: { type: String, enum: ['listed', 'reduced', 'increased'], default: 'listed' },
        }],
        photosVerifiedAt: { type: Date },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number },
        },
        agentId: { type: Schema.Types.ObjectId, ref: 'Agent' }
    },
    {
        timestamps: true,
    }
);

// Indexes for scalable queries
PropertySchema.index({ citySlug: 1, bedrooms: 1, status: 1 });
PropertySchema.index({ slug: 1 }, { unique: true });

const Property = models.Property || model<IProperty>('Property', PropertySchema);

export default Property;
