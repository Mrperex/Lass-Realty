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
        const title_fr = formData.get('title_fr') as string | null;
        const title_it = formData.get('title_it') as string | null;
        const title_de = formData.get('title_de') as string | null;
        const title_ru = formData.get('title_ru') as string | null;
        const title_ht = formData.get('title_ht') as string | null;

        const description = formData.get('description') as string;
        const description_es = formData.get('description_es') as string | null;
        const description_fr = formData.get('description_fr') as string | null;
        const description_it = formData.get('description_it') as string | null;
        const description_de = formData.get('description_de') as string | null;
        const description_ru = formData.get('description_ru') as string | null;
        const description_ht = formData.get('description_ht') as string | null;
        const price = Number(formData.get('price'));
        const city = formData.get('city') as string;
        const city_es = formData.get('city_es') as string | null;
        const city_fr = formData.get('city_fr') as string | null;
        const city_it = formData.get('city_it') as string | null;
        const city_de = formData.get('city_de') as string | null;
        const city_ru = formData.get('city_ru') as string | null;
        const city_ht = formData.get('city_ht') as string | null;
        const bedrooms = Number(formData.get('bedrooms'));
        const bathrooms = Number(formData.get('bathrooms'));
        const squareMeters = Number(formData.get('squareMeters'));
        const status = formData.get('status') as string;
        const featured = formData.get('featured') === 'on';
        const amenitiesEntries = formData.getAll('amenities[]');
        const amenities = amenitiesEntries.filter(entry => typeof entry === 'string' && entry.trim() !== '') as string[];
        const virtualTourUrl = formData.get('virtualTourUrl') as string | null;

        const deposit = formData.get('deposit') ? Number(formData.get('deposit')) : undefined;
        const maintenanceFee = formData.get('maintenanceFee') ? Number(formData.get('maintenanceFee')) : undefined;
        const rentPeriod = formData.get('rentPeriod') as string | undefined;

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
            title_fr: title_fr || undefined,
            title_it: title_it || undefined,
            title_de: title_de || undefined,
            title_ru: title_ru || undefined,
            title_ht: title_ht || undefined,
            slug,
            description,
            description_es: description_es || undefined,
            description_fr: description_fr || undefined,
            description_it: description_it || undefined,
            description_de: description_de || undefined,
            description_ru: description_ru || undefined,
            description_ht: description_ht || undefined,
            price,
            city,
            city_es: city_es || undefined,
            city_fr: city_fr || undefined,
            city_it: city_it || undefined,
            city_de: city_de || undefined,
            city_ru: city_ru || undefined,
            city_ht: city_ht || undefined,
            citySlug,
            bedrooms,
            bathrooms,
            squareMeters,
            status,
            featured,
            amenities,
            virtualTourUrl: virtualTourUrl || undefined,
            deposit,
            maintenanceFee,
            rentPeriod,
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
        const title_fr = formData.get('title_fr') as string | null;
        const title_it = formData.get('title_it') as string | null;
        const title_de = formData.get('title_de') as string | null;
        const title_ru = formData.get('title_ru') as string | null;
        const title_ht = formData.get('title_ht') as string | null;

        const description = formData.get('description') as string;
        const description_es = formData.get('description_es') as string | null;
        const description_fr = formData.get('description_fr') as string | null;
        const description_it = formData.get('description_it') as string | null;
        const description_de = formData.get('description_de') as string | null;
        const description_ru = formData.get('description_ru') as string | null;
        const description_ht = formData.get('description_ht') as string | null;
        const price = Number(formData.get('price'));
        const city = formData.get('city') as string;
        const city_es = formData.get('city_es') as string | null;
        const city_fr = formData.get('city_fr') as string | null;
        const city_it = formData.get('city_it') as string | null;
        const city_de = formData.get('city_de') as string | null;
        const city_ru = formData.get('city_ru') as string | null;
        const city_ht = formData.get('city_ht') as string | null;
        const bedrooms = Number(formData.get('bedrooms'));
        const bathrooms = Number(formData.get('bathrooms'));
        const squareMeters = Number(formData.get('squareMeters'));
        const status = formData.get('status') as string;
        const featured = formData.get('featured') === 'on';
        const amenitiesEntries = formData.getAll('amenities[]');
        const amenities = amenitiesEntries.filter(entry => typeof entry === 'string' && entry.trim() !== '') as string[];
        const virtualTourUrl = formData.get('virtualTourUrl') as string | null;

        const deposit = formData.get('deposit') ? Number(formData.get('deposit')) : undefined;
        const maintenanceFee = formData.get('maintenanceFee') ? Number(formData.get('maintenanceFee')) : undefined;
        const rentPeriod = formData.get('rentPeriod') as string | undefined;
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
            title_fr: title_fr || undefined,
            title_it: title_it || undefined,
            title_de: title_de || undefined,
            title_ru: title_ru || undefined,
            title_ht: title_ht || undefined,
            description,
            description_es: description_es || undefined,
            description_fr: description_fr || undefined,
            description_it: description_it || undefined,
            description_de: description_de || undefined,
            description_ru: description_ru || undefined,
            description_ht: description_ht || undefined,
            price,
            city,
            city_es: city_es || undefined,
            city_fr: city_fr || undefined,
            city_it: city_it || undefined,
            city_de: city_de || undefined,
            city_ru: city_ru || undefined,
            city_ht: city_ht || undefined,
            bedrooms,
            bathrooms,
            squareMeters,
            status,
            featured,
            amenities,
            virtualTourUrl,
            deposit,
            maintenanceFee,
            rentPeriod: (rentPeriod && rentPeriod !== '') ? rentPeriod : undefined,
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
