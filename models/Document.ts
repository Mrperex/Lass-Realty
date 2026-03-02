import mongoose, { Schema, models } from 'mongoose'

const DocumentSchema = new Schema(
    {
        url: { type: String, required: true },
        publicId: { type: String, required: true },

        type: {
            type: String,
            enum: ['listing-agreement', 'contract', 'other'],
            default: 'other',
        },

        propertyId: {
            type: Schema.Types.ObjectId,
            ref: 'Property',
            default: null,
        },

        leadId: {
            type: Schema.Types.ObjectId,
            ref: 'Lead',
            default: null,
        },

        uploadedBy: {
            type: String,
            default: 'admin',
        },
    },
    { timestamps: true }
)

export default models.Document || mongoose.model('Document', DocumentSchema)
