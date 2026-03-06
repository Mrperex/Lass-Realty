import mongoose, { Schema, model, models } from 'mongoose';
import { INeighborhood } from '@/types/neighborhood';

const NeighborhoodSchema = new Schema<INeighborhood>(
    {
        name: { type: String, required: true },
        name_es: { type: String },
        name_fr: { type: String },
        name_it: { type: String },
        name_de: { type: String },
        name_ru: { type: String },
        name_ht: { type: String },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        description_es: { type: String },
        description_fr: { type: String },
        description_it: { type: String },
        description_de: { type: String },
        description_ru: { type: String },
        description_ht: { type: String },
        heroImage: { type: String },
        gallery: { type: [String], default: [] },
        highlights: { type: [String], default: [] },
        highlights_es: { type: [String], default: [] },
        highlights_fr: { type: [String], default: [] },
        highlights_it: { type: [String], default: [] },
        highlights_de: { type: [String], default: [] },
        highlights_ru: { type: [String], default: [] },
        highlights_ht: { type: [String], default: [] },
        mapCoordinates: {
            lat: { type: Number },
            lng: { type: Number },
        },
        averagePrice: { type: Number },
    },
    {
        timestamps: true,
    }
);

// Indexes
NeighborhoodSchema.index({ slug: 1 }, { unique: true });

const Neighborhood = models.Neighborhood || model<INeighborhood>('Neighborhood', NeighborhoodSchema);

export default Neighborhood;
