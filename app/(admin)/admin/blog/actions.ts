'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import { IPost } from '@/types/post';

export async function createPost(data: Partial<IPost>) {
    await connectToDatabase();

    try {
        const post = new Post(data);
        await post.save();
        revalidatePath('/admin/blog');
        revalidatePath('/blog');
        return { success: true, id: post._id.toString() };
    } catch (error: any) {
        console.error('Error creating post:', error);
        return { success: false, error: error.message };
    }
}

export async function updatePost(id: string, data: Partial<IPost>) {
    await connectToDatabase();

    try {
        await Post.findByIdAndUpdate(id, data);
        revalidatePath('/admin/blog');
        revalidatePath('/blog');
        if (data.slug) {
            revalidatePath(`/blog/${data.slug}`);
        }
        return { success: true };
    } catch (error: any) {
        console.error('Error updating post:', error);
        return { success: false, error: error.message };
    }
}

export async function deletePost(id: string) {
    await connectToDatabase();

    try {
        await Post.findByIdAndDelete(id);
        revalidatePath('/admin/blog');
        revalidatePath('/blog');
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting post:', error);
        return { success: false, error: error.message };
    }
}

export async function getPostsAdmin() {
    await connectToDatabase();

    try {
        const posts = await Post.find().sort({ publishedAt: -1 }).lean();
        return JSON.parse(JSON.stringify(posts));
    } catch (error: any) {
        console.error('Error fetching admin posts:', error);
        return [];
    }
}

export async function getPostAdmin(id: string) {
    await connectToDatabase();

    try {
        const post = await Post.findById(id).lean();
        return JSON.parse(JSON.stringify(post));
    } catch (error: any) {
        console.error('Error fetching single admin post:', error);
        return null;
    }
}
