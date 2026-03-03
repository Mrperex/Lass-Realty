import Link from 'next/link';
import { getNeighborhoodsAdmin, deleteNeighborhood } from './actions';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function AdminNeighborhoodsPage() {
    const neighborhoods = await getNeighborhoodsAdmin();

    async function handleDelete(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        await deleteNeighborhood(id);
        revalidatePath('/admin/neighborhoods');
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-light text-navy-900 mb-2">Neighborhood Guides</h1>
                    <p className="text-gray-500">Manage luxury location hubs and regional highlights.</p>
                </div>
                <Link
                    href="/admin/neighborhoods/new"
                    className="mt-4 sm:mt-0 flex items-center bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 text-sm uppercase tracking-wider rounded-none transition-colors"
                >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    New Neighborhood
                </Link>
            </div>

            <div className="bg-white shadow-sm overflow-hidden min-h-[500px]">
                {neighborhoods.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <p>No neighborhood guides found. Create your first location!</p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Avg Price
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {neighborhoods.map((n: any) => (
                                <tr key={n._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {n.heroImage ? (
                                                <img src={n.heroImage} className="w-12 h-12 object-cover rounded-md" alt="" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 rounded-md" />
                                            )}
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-navy-900">
                                                    {n.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    /{n.slug}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {n.averagePrice ? `$${n.averagePrice.toLocaleString()}` : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-3">
                                            <Link
                                                href={`/admin/neighborhoods/${n._id}/edit`}
                                                className="text-gray-400 hover:text-gold-500 transition-colors"
                                                title="Edit Guide"
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </Link>
                                            <form action={handleDelete}>
                                                <input type="hidden" name="id" value={n._id} />
                                                <button
                                                    type="submit"
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Delete Guide"
                                                    onClick={(e) => {
                                                        if (!confirm('Are you sure you want to delete this neighborhood guide?')) {
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
