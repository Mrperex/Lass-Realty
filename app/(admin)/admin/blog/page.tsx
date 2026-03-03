import Link from 'next/link';
import { getPostsAdmin, deletePost } from './actions';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function AdminBlogPage() {
    const posts = await getPostsAdmin();

    async function handleDelete(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        await deletePost(id);
        revalidatePath('/admin/blog');
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-light text-navy-900 mb-2">Blog Posts</h1>
                    <p className="text-gray-500">Manage real estate market updates and buying guides.</p>
                </div>
                <Link
                    href="/admin/blog/new"
                    className="mt-4 sm:mt-0 flex items-center bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 text-sm uppercase tracking-wider rounded-none transition-colors"
                >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Write New Post
                </Link>
            </div>

            <div className="bg-white shadow-sm overflow-hidden min-h-[500px]">
                {posts.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <p>No blog posts found. Write your first article!</p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Published
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {posts.map((post: any) => (
                                <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-navy-900">
                                                    {post.title}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    /{post.slug}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {post.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(post.publishedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-3">
                                            <Link
                                                href={`/admin/blog/${post._id}/edit`}
                                                className="text-gray-400 hover:text-gold-500 transition-colors"
                                                title="Edit Post"
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </Link>
                                            <form action={handleDelete}>
                                                <input type="hidden" name="id" value={post._id} />
                                                <button
                                                    type="submit"
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Delete Post"
                                                    onClick={(e) => {
                                                        if (!confirm('Are you sure you want to delete this post?')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
