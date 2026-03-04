import mongoose, { Schema, model, models } from 'mongoose';

export interface IAgent {
    _id?: string;
    name: string;
    role: string;
    role_es?: string;
    bio: string;
    bio_es?: string;
    email: string;
    phone: string;
    whatsapp?: string;
    photo: string;
    languages: string[];
    languages_es?: string[];
    facebookUrl?: string;
    instagramUrl?: string;
    linkedinUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const AgentSchema = new Schema<IAgent>(
    {
        name: { type: String, required: true },
        role: { type: String, required: true },
        role_es: { type: String },
        bio: { type: String, required: true },
        bio_es: { type: String },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        whatsapp: { type: String },
        photo: { type: String, required: true },
        languages: { type: [String], default: [] },
        languages_es: { type: [String], default: [] },
        facebookUrl: { type: String },
        instagramUrl: { type: String },
        linkedinUrl: { type: String },
    },
    { timestamps: true }
);

const Agent = models.Agent || model<IAgent>('Agent', AgentSchema);

export default Agent;
