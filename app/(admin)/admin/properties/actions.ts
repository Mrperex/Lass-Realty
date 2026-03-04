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
        const title_es = formData.get('title_es') as string | null;
        const description = formData.get('description') as string;
        const description_es = formData.get('description_es') as string | null;
        const price = Number(formData.get('price'));
        const city = formData.get('city') as string;
        const city_es = formData.get('city_es') as string | null;
        const bedrooms = Number(formData.get('bedrooms'));
        const bathrooms = Number(formData.get('bathrooms'));
        const squareMeters = Number(formData.get('squareMeters'));
        const status = formData.get('status') as string;
        const featured = formData.get('featured') === 'on';
        const amenitiesEntries = formData.getAll('amenities[]');
        const amenities = amenitiesEntries.filter(entry => typeof entry === 'string' && entry.trim() !== '') as string[];
        const virtualTourUrl = formData.get('virtualTourUrl') as string | null;

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

        // Gather multiple floor plan URLs from form data
        const floorPlanEntries = formData.getAll('floorPlans');
        const floorPlans: string[] = floorPlanEntries.filter(entry => typeof entry === 'string' && entry.trim() !== '') as string[];

        await Property.create({
            title,
            title_es: title_es || undefined,
            slug,
            description,
            description_es: description_es || undefined,
            price,
            city,
            city_es: city_es || undefined,
            citySlug,
            bedrooms,
            bathrooms,
            squareMeters,
            status,
            featured,
            amenities,
            virtualTourUrl: virtualTourUrl || undefined,
            images,
            floorPlans
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
        const title_es = formData.get('title_es') as string | null;
        const description = formData.get('description') as string;
        const description_es = formData.get('description_es') as string | null;
        const price = Number(formData.get('price'));
        const city = formData.get('city') as string;
        const city_es = formData.get('city_es') as string | null;
        const bedrooms = Number(formData.get('bedrooms'));
        const bathrooms = Number(formData.get('bathrooms'));
        const squareMeters = Number(formData.get('squareMeters'));
        const status = formData.get('status') as string;
        const featured = formData.get('featured') === 'on';
        const amenitiesEntries = formData.getAll('amenities[]');
        const amenities = amenitiesEntries.filter(entry => typeof entry === 'string' && entry.trim() !== '') as string[];
        const virtualTourUrl = formData.get('virtualTourUrl') as string | null;
        const citySlug = city.toLowerCase().replace(/\s+/g, '-');

        if (!title || !description || !price || !city || isNaN(bedrooms) || isNaN(bathrooms) || isNaN(squareMeters)) {
            return { error: 'Please fill out all required fields correctly.' };
        }

        const imageEntries = formData.getAll('images');
        const images: string[] = imageEntries.filter(entry => typeof entry === 'string' && entry.trim() !== '') as string[];

        const floorPlanEntries = formData.getAll('floorPlans');
        const floorPlans: string[] = floorPlanEntries.filter(entry => typeof entry === 'string' && entry.trim() !== '') as string[];

        await Property.findByIdAndUpdate(id, {
            title,
            title_es: title_es || undefined,
            description,
            description_es: description_es || undefined,
            price,
            city,
            city_es: city_es || undefined,
            bedrooms,
            bathrooms,
            squareMeters,
            status,
            featured,
            amenities,
            virtualTourUrl,
            images,
            floorPlans
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

        // Cleanup floor plans from Cloudinary
        if (property.floorPlans && property.floorPlans.length > 0) {
            for (const url of property.floorPlans) {
                try {
                    const urlParts = url.split('/');
                    const filename = urlParts[urlParts.length - 1];
                    const publicId = filename.split('.')[0];
                    if (publicId) {
                        await cloudinary.uploader.destroy(publicId);
                    }
                } catch (imgError) {
                    console.warn('Failed to delete floor plan from Cloudinary:', imgError);
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
