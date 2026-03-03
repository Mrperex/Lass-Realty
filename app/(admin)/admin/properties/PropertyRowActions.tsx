'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';
import { deleteProperty } from './actions';

export default function PropertyRowActions({ propertyId }: { propertyId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        const res = await deleteProperty(propertyId);
        if (res.error) {
            alert(res.error);
            setIsDeleting(false);
        }
        // If success, the server action revalidates the path and the row disappears.
    };

    return (
        <div className="flex justify-end gap-2">
            <Link
                href={`/admin/properties/${propertyId}/edit`}
                className="text-slate-400 border border-slate-200 p-2 rounded-lg hover:bg-slate-100 hover:text-amber-600 transition-colors"
                aria-label="Edit property"
            >
                <Edit className="w-4 h-4" />
            </Link>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-slate-400 border border-slate-200 p-2 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50"
                aria-label="Delete property"
            >
                {isDeleting ? (
                    <span className="inline-block h-4 w-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin"></span>
                ) : (
                    <Trash2 className="w-4 h-4" />
                )}
            </button>
        </div>
    );
}
