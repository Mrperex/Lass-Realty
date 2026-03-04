import Link from 'next/link';
import { getNeighborhoodsAdmin, deleteNeighborhood } from './actions';
import { PlusCircle, Pencil } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import DeleteButton from '../components/DeleteButton';

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
                    className="mt-4 sm:mt-0 flex items-center bg-navy-900 hover:bg-navy-800 text-white px-5 py-3 text-sm font-bold uppercase tracking-wider transition-colors shadow-md"
                >
                    <PlusCircle className="w-5 h-5 mr-2" />
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
                                            <DeleteButton id={n._id} action={handleDelete} label="Delete Guide" />
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
