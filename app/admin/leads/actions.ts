'use server';

import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { revalidatePath } from 'next/cache';

export async function updateLeadStatus(leadId: string, status: string) {
    try {
        await connectToDatabase();
        await Lead.findByIdAndUpdate(leadId, { status });
        revalidatePath('/admin/leads');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to update lead status:', error);
        return { error: 'Failed to update status' };
    }
}

export async function addLeadNote(leadId: string, noteText: string) {
    try {
        await connectToDatabase();
        await Lead.findByIdAndUpdate(leadId, {
            $push: { notes: { text: noteText, createdAt: new Date() } }
        });
        revalidatePath('/admin/leads');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to add lead note:', error);
        return { error: 'Failed to add note' };
    }
}
