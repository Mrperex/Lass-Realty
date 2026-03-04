'use client';

import { Trash2 } from 'lucide-react';

export default function DeleteButton({ id, action, label }: {
    id: string;
    action: (formData: FormData) => Promise<void>;
    label: string;
}) {
    return (
        <form action={action}>
            <input type="hidden" name="id" value={id} />
            <button
                type="submit"
                className="text-gray-400 hover:text-red-500 transition-colors"
                title={label}
                onClick={(e) => {
                    if (!confirm(`Are you sure you want to delete this?`)) {
                        e.preventDefault();
                    }
                }}
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </form>
    );
}
