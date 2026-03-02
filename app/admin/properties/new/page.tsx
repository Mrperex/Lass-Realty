'use client';

import { useState, useRef } from 'react';
import { createProperty } from '../actions';
import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { ArrowLeft, Save, UploadCloud, X } from 'lucide-react';

const initialState = {
    error: '',
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors shadow-sm disabled:opacity-50"
        >
            {pending ? (
                <span className="inline-block h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
                <Save className="w-5 h-5" />
            )}
            {pending ? 'Saving...' : 'Save Property'}
        </button>
    );
}

export default function NewPropertyPage() {
    const [state, formAction] = useFormState(createProperty, initialState);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingImages(true);

        try {
            const timestamp = Math.round((new Date()).getTime() / 1000);

            // Get signature
            const sigRes = await fetch('/api/admin/cloudinary-sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paramsToSign: { timestamp } })
            });

            if (!sigRes.ok) throw new Error('Failed to get upload signature');
            const { signature, apiKey, cloudName } = await sigRes.json();

            const uploadedUrls: string[] = [];

            // Upload each file
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append('file', file);
                formData.append('api_key', apiKey);
                formData.append('timestamp', timestamp.toString());
                formData.append('signature', signature);

                const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: 'POST',
                    body: formData
                });

                if (!uploadRes.ok) throw new Error('Upload failed');
                const uploadData = await uploadRes.json();
                uploadedUrls.push(uploadData.secure_url);
            }

            setImageUrls(prev => [...prev, ...uploadedUrls]);

        } catch (error) {
            console.error("Image upload error:", error);
            alert("Failed to upload images. Check that your environment variables are set in .env.local");
        } finally {
            setUploadingImages(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImageUrls(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/properties"
                    className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Add New Property</h1>
                    <p className="text-slate-500 mt-1">Create a new listing in your real estate portfolio.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <form action={formAction} className="p-8 space-y-8">
                    {state?.error && (
                        <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-xl text-sm font-medium">
                            {state.error}
                        </div>
                    )}

                    {/* Basic Info */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Basic Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Property Title</label>
                                <input type="text" id="title" name="title" required className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow" placeholder="e.g. Modern Beachfront Villa in Cap Cana" />
                                <p className="text-xs text-slate-500 mt-1.5">Slug will be auto-generated from this title.</p>
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea id="description" name="description" rows={5} required className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow" placeholder="Describe the property..." />
                            </div>

                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">Price (USD)</label>
                                <input type="number" id="price" name="price" required min="0" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow" placeholder="e.g. 1500000" />
                            </div>

                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1">Location (City)</label>
                                <input type="text" id="city" name="city" required className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow" placeholder="e.g. Punta Cana" />
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Property Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="bedrooms" className="block text-sm font-medium text-slate-700 mb-1">Bedrooms</label>
                                <input type="number" id="bedrooms" name="bedrooms" required min="0" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow" placeholder="e.g. 4" />
                            </div>

                            <div>
                                <label htmlFor="bathrooms" className="block text-sm font-medium text-slate-700 mb-1">Bathrooms</label>
                                <input type="number" id="bathrooms" name="bathrooms" required min="0" step="0.5" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow" placeholder="e.g. 3.5" />
                            </div>

                            <div>
                                <label htmlFor="squareMeters" className="block text-sm font-medium text-slate-700 mb-1">Square Meters</label>
                                <input type="number" id="squareMeters" name="squareMeters" required min="0" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow" placeholder="e.g. 350" />
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Property Images</h3>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingImages}
                                    className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                                >
                                    <UploadCloud className="w-5 h-5" />
                                    {uploadingImages ? 'Uploading...' : 'Upload Images'}
                                </button>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                />
                                <span className="text-sm text-slate-500">
                                    Select multiple high-quality photos.
                                </span>
                            </div>

                            {/* Hidden inputs to pass URL strings to server action */}
                            {imageUrls.map((url, idx) => (
                                <input key={`img-hidden-${idx}`} type="hidden" name="images" value={url} />
                            ))}

                            {/* Image Previews */}
                            {imageUrls.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-6">
                                    {imageUrls.map((url, idx) => (
                                        <div key={`img-${idx}`} className="relative aspect-[4/3] rounded-xl overflow-hidden group border border-slate-200">
                                            <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status & Options */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Status & Presentation</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <select id="status" name="status" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow bg-white">
                                    <option value="for-sale">For Sale</option>
                                    <option value="reserved">Reserved</option>
                                    <option value="sold">Sold</option>
                                </select>
                            </div>

                            <div className="flex items-center pt-8">
                                <div className="flex items-center h-5">
                                    <input id="featured" name="featured" type="checkbox" className="w-5 h-5 text-amber-600 border-slate-300 rounded focus:ring-amber-500" />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="featured" className="font-medium text-slate-900">Featured Property</label>
                                    <p className="text-slate-500">Show this property on the homepage.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                        <Link
                            href="/admin/properties"
                            className="px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            Cancel
                        </Link>
                        <SubmitButton />
                    </div>

                </form>
            </div>
        </div>
    );
}
