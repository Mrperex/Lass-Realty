import mongoose, { Schema, model, models } from 'mongoose';
import { ILead } from '@/types/lead';

const LeadSchema = new Schema<ILead>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        message: { type: String, required: true },
        propertySlug: { type: String },
    },
    {
        timestamps: true,
    }
);

const Lead = models.Lead || model<ILead>('Lead', LeadSchema);

export default Lead;
