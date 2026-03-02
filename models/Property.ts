import mongoose, { Schema, model, models } from 'mongoose';
import { IProperty } from '@/types/property';

const PropertySchema = new Schema<IProperty>(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        city: { type: String, required: true },
        citySlug: { type: String, required: true },
        bedrooms: { type: Number, required: true },
        bathrooms: { type: Number, required: true },
        squareMeters: { type: Number, required: true },
        images: { type: [String], required: true },
        featured: { type: Boolean, default: false },
        status: { type: String, enum: ['for-sale', 'sold', 'reserved'], default: 'for-sale' },
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
