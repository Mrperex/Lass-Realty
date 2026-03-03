'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/mongodb';
import Neighborhood from '@/models/Neighborhood';
import { INeighborhood } from '@/types/neighborhood';

export async function createNeighborhood(data: Partial<INeighborhood>) {
    await connectToDatabase();

    try {
        const neighborhood = new Neighborhood(data);
        await neighborhood.save();
        revalidatePath('/admin/neighborhoods');
        revalidatePath('/locations');
        return { success: true, id: neighborhood._id.toString() };
    } catch (error: any) {
        console.error('Error creating neighborhood:', error);
        return { success: false, error: error.message };
    }
}

export async function updateNeighborhood(id: string, data: Partial<INeighborhood>) {
    await connectToDatabase();

    try {
        await Neighborhood.findByIdAndUpdate(id, data);
        revalidatePath('/admin/neighborhoods');
        revalidatePath('/locations');
        if (data.slug) {
            revalidatePath(`/locations/${data.slug}`);
        }
        return { success: true };
    } catch (error: any) {
        console.error('Error updating neighborhood:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteNeighborhood(id: string) {
    await connectToDatabase();

    try {
        await Neighborhood.findByIdAndDelete(id);
        revalidatePath('/admin/neighborhoods');
        revalidatePath('/locations');
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting neighborhood:', error);
        return { success: false, error: error.message };
    }
}

export async function getNeighborhoodsAdmin() {
    await connectToDatabase();

    try {
        const neighborhoods = await Neighborhood.find().sort({ name: 1 }).lean();
        return JSON.parse(JSON.stringify(neighborhoods));
    } catch (error: any) {
        console.error('Error fetching admin neighborhoods:', error);
        return [];
    }
}

export async function getNeighborhoodAdmin(id: string) {
    await connectToDatabase();

    try {
        const neighborhood = await Neighborhood.findById(id).lean();
        return JSON.parse(JSON.stringify(neighborhood));
    } catch (error: any) {
        console.error('Error fetching single admin neighborhood:', error);
        return null;
    }
}
