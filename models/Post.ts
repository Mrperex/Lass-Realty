import mongoose, { Schema, model, models } from 'mongoose';
import { IPost } from '@/types/post';

const PostSchema = new Schema<IPost>(
    {
        title: { type: String, required: true },
        title_es: { type: String },
        title_fr: { type: String },
        title_it: { type: String },
        title_de: { type: String },
        title_ru: { type: String },
        title_ht: { type: String },
        slug: { type: String, required: true, unique: true },
        content: { type: String, required: true },
        content_es: { type: String },
        content_fr: { type: String },
        content_it: { type: String },
        content_de: { type: String },
        content_ru: { type: String },
        content_ht: { type: String },
        excerpt: { type: String, required: true },
        excerpt_es: { type: String },
        excerpt_fr: { type: String },
        excerpt_it: { type: String },
        excerpt_de: { type: String },
        excerpt_ru: { type: String },
        excerpt_ht: { type: String },
        coverImage: { type: String },
        author: { type: String, required: true },
        category: {
            type: String,
            enum: ['market-update', 'buying-guide', 'lifestyle', 'news'],
            required: true,
        },
        publishedAt: { type: Date, required: true },
        featured: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

// Indexes
PostSchema.index({ slug: 1 }, { unique: true });
PostSchema.index({ publishedAt: -1 }); // Fast sorting for latest posts

const Post = models.Post || model<IPost>('Post', PostSchema);

export default Post;
