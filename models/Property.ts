import mongoose, { Schema, model, models } from 'mongoose';
import { IProperty } from '@/types/property';

const PropertySchema = new Schema<IProperty>(
    {
        title: { type: String, required: true },
        title_es: { type: String },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        description_es: { type: String },
        price: { type: Number, required: true },
        city: { type: String, required: true },
        city_es: { type: String },
        citySlug: { type: String, required: true },
        bedrooms: { type: Number, required: true },
        bathrooms: { type: Number, required: true },
        squareMeters: { type: Number, required: true },
        images: { type: [String], required: true },
        featured: { type: Boolean, default: false },
        status: { type: String, enum: ['for-sale', 'sold', 'reserved', 'for-rent', 'rented'], default: 'for-sale' },
        pool: { type: Boolean, default: false },
        oceanView: { type: Boolean, default: false },
        golfView: { type: Boolean, default: false },
        furnished: { type: Boolean, default: false },
        petFriendly: { type: Boolean, default: false },
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
