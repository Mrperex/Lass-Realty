'use server';

import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import cloudinary from '@/lib/cloudinary';

export async function createProperty(prevState: any, formData: FormData) {
    try {
        await connectToDatabase();

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const price = Number(formData.get('price'));
        const city = formData.get('city') as string;
        const bedrooms = Number(formData.get('bedrooms'));
        const bathrooms = Number(formData.get('bathrooms'));
        const squareMeters = Number(formData.get('squareMeters'));
        const status = formData.get('status') as string;
        const featured = formData.get('featured') === 'on';

        // Auto-generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        const citySlug = city.toLowerCase().replace(/\s+/g, '-');

        if (!title || !description || !price || !city || isNaN(bedrooms) || isNaN(bathrooms) || isNaN(squareMeters)) {
            return { error: 'Please fill out all required fields correctly.' };
        }

        // Validation - ensure unique slug
        const existing = await Property.findOne({ slug });
        if (existing) {
            return { error: 'A property with a similar title already exists. Please modify the title.' };
        }

        // Gather multiple image URLs from form data
        const imageEntries = formData.getAll('images');
        const images: string[] = imageEntries.filter(entry => typeof entry === 'string' && entry.trim() !== '') as string[];

        await Property.create({
            title,
            slug,
            description,
            price,
            city,
            citySlug,
            bedrooms,
            bathrooms,
            squareMeters,
            status,
            featured,
            images
        });

    } catch (error: any) {
        return { error: error.message || 'Failed to create property.' }
    }

    revalidatePath('/admin/properties');
    revalidatePath('/properties');
    revalidatePath(`/locations/${formData.get('city')}`);
    redirect('/admin/properties');
}

export async function updateProperty(id: string, prevState: any, formData: FormData) {
    try {
        await connectToDatabase();

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const price = Number(formData.get('price'));
        const city = formData.get('city') as string;
        const bedrooms = Number(formData.get('bedrooms'));
        const bathrooms = Number(formData.get('bathrooms'));
        const squareMeters = Number(formData.get('squareMeters'));
        const status = formData.get('status') as string;
        const featured = formData.get('featured') === 'on';
        const citySlug = city.toLowerCase().replace(/\s+/g, '-');

        if (!title || !description || !price || !city || isNaN(bedrooms) || isNaN(bathrooms) || isNaN(squareMeters)) {
            return { error: 'Please fill out all required fields correctly.' };
        }

        const imageEntries = formData.getAll('images');
        const images: string[] = imageEntries.filter(entry => typeof entry === 'string' && entry.trim() !== '') as string[];

        await Property.findByIdAndUpdate(id, {
            title,
            description,
            price,
            city,
            bedrooms,
            bathrooms,
            squareMeters,
            status,
            featured,
            images
        });

    } catch (error: any) {
        return { error: error.message || 'Failed to update property.' }
    }

    revalidatePath('/admin/properties');
    revalidatePath('/properties');
    revalidatePath(`/properties/${id}`);
    redirect('/admin/properties');
}

export async function deleteProperty(id: string) {
    try {
        await connectToDatabase();

        const property = await Property.findById(id);
        if (!property) throw new Error('Property not found');

        // Cleanup images from Cloudinary
        if (property.images && property.images.length > 0) {
            for (const url of property.images) {
                try {
                    // Extract public ID from URL (e.g. .../upload/v1234/public_id.jpg)
                    const urlParts = url.split('/');
                    const filename = urlParts[urlParts.length - 1];
                    const publicId = filename.split('.')[0];
                    if (publicId) {
                        await cloudinary.uploader.destroy(publicId);
                    }
                } catch (imgError) {
                    console.warn('Failed to delete image from Cloudinary:', imgError);
                }
            }
        }

        await Property.findByIdAndDelete(id);
        revalidatePath('/admin/properties');
        revalidatePath('/properties');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to delete property:', error);
        return { error: error.message || 'Failed to delete property' };
    }
}
