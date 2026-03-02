import mongoose, { Schema, model, models } from 'mongoose';
import { IProperty } from '@/types/property';

const PropertySchema = new Schema<IProperty>(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        city: { type: String, required: true },
        bedrooms: { type: Number, required: true },
        bathrooms: { type: Number, required: true },
        images: { type: [String], required: true },
        featured: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const Property = models.Property || model<IProperty>('Property', PropertySchema);

export default Property;
