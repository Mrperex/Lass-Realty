import mongoose, { Schema, model, models } from 'mongoose';
import { INeighborhood } from '@/types/neighborhood';

const NeighborhoodSchema = new Schema<INeighborhood>(
    {
        name: { type: String, required: true },
        name_es: { type: String },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        description_es: { type: String },
        heroImage: { type: String },
        gallery: { type: [String], default: [] },
        highlights: { type: [String], default: [] },
        highlights_es: { type: [String], default: [] },
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
