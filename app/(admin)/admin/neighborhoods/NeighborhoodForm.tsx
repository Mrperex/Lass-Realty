'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNeighborhood, updateNeighborhood } from './actions';
import { INeighborhood } from '@/types/neighborhood';
import { Save, Loader2, ImagePlus, Trash2, Plus, X } from 'lucide-react';

interface NeighborhoodFormProps {
    initialData?: INeighborhood;
}

export default function NeighborhoodForm({ initialData }: NeighborhoodFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeLanguage, setActiveLanguage] = useState<'en' | 'es' | 'fr' | 'it' | 'de' | 'ru' | 'ht'>('en');

    // Default empty state
    const [formData, setFormData] = useState<Partial<INeighborhood>>(
        initialData || {
            name: '', name_es: '', name_fr: '', name_it: '', name_de: '', name_ru: '', name_ht: '',
            slug: '',
            description: '', description_es: '', description_fr: '', description_it: '', description_de: '', description_ru: '', description_ht: '',
            heroImage: '',
            gallery: [],
            highlights: [], highlights_es: [], highlights_fr: [], highlights_it: [], highlights_de: [], highlights_ru: [], highlights_ht: [],
            mapCoordinates: { lat: 0, lng: 0 },
            averagePrice: 0,
        }
    );

    const isEditMode = !!initialData?._id;

    // Helper to generate slug from EN name if empty
    const handleNameChange = (val: string) => {
        setFormData((prev) => {
            const updates = { ...prev, name: val };
            if (!isEditMode && (!prev.slug || prev.slug === '')) {
                updates.slug = val
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');
            }
            return updates;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const dataToSave = { ...formData };

        try {
            let res;
            if (isEditMode && initialData._id) {
                res = await updateNeighborhood(initialData._id, dataToSave);
            } else {
                res = await createNeighborhood(dataToSave);
            }

            if (res.success) {
                router.push('/admin/neighborhoods');
                router.refresh();
            } else {
                alert('Error explicitly saving neighborhood: ' + res.error);
                setIsSubmitting(false);
            }
        } catch (err: any) {
            alert('Fatal form upload parsing error');
            setIsSubmitting(false);
        }
    };

    // --- Cloudinary Integration ---
    const [uploadingImage, setUploadingImage] = useState(false);
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        setUploadingImage(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            uploadFormData.append('upload_preset', 'lass_realty_admin');

            const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: uploadFormData,
            });

            if (!res.ok) throw new Error('Cloudinary upload failed');

            const result = await res.json();
            setFormData((prev) => ({ ...prev, heroImage: result.secure_url }));
        } catch (error) {
            console.error('Image upload failed:', error);
            alert('Image upload failed to complete.');
        } finally {
            setUploadingImage(false);
        }
    };

    const removeImage = () => {
        setFormData((prev) => ({ ...prev, heroImage: '' }));
    };

    // --- Highlights Management ---
    const [newHighlight, setNewHighlight] = useState('');

    const addHighlight = () => {
        if (!newHighlight.trim()) return;

        const highlightKey = activeLanguage === 'en' ? 'highlights' : `highlights_${activeLanguage}`;

        setFormData(prev => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const currentArray = (prev as any)[highlightKey] || [];
            return {
                ...prev,
                [highlightKey]: [...currentArray, newHighlight.trim()]
            };
        });
        setNewHighlight('');
    };

    const removeHighlight = (index: number) => {
        const highlightKey = activeLanguage === 'en' ? 'highlights' : `highlights_${activeLanguage}`;
        setFormData(prev => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const currentArray = (prev as any)[highlightKey] || [];
            return {
                ...prev,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                [highlightKey]: currentArray.filter((_: any, i: number) => i !== index)
            };
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-24">
            {/* Header Actions */}
            <div className="flex justify-between items-center bg-white p-6 shadow-sm sticky top-0 z-10 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl font-light text-navy-900">
                        {isEditMode ? 'Edit Neighborhood Guide' : 'Create Neighborhood Guide'}
                    </h1>
                </div>
                <div className="flex gap-4 items-center">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/neighborhoods')}
                        className="text-gray-500 hover:text-navy-900 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center bg-gold-500 hover:bg-gold-600 text-white px-6 py-2 uppercase tracking-wider text-sm transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        {isSubmitting ? 'Saving...' : 'Publish Guide'}
                    </button>
                </div>
            </div>

            {/* Main Form Body */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6">

                {/* Left Column: Language & Content */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Language Tabs */}
                    <div className="bg-white p-1 rounded-none shadow-sm flex flex-wrap gap-1 mb-2 border border-gray-200">
                        {[
                            { code: 'en', label: 'English (EN)' },
                            { code: 'es', label: 'Spanish (ES)' },
                            { code: 'fr', label: 'French (FR)' },
                            { code: 'it', label: 'Italian (IT)' },
                            { code: 'de', label: 'German (DE)' },
                            { code: 'ru', label: 'Russian (RU)' },
                            { code: 'ht', label: 'Creole (HT)' }
                        ].map(({ code, label }) => (
                            <button
                                key={code}
                                type="button"
                                className={`px-4 py-2 text-xs uppercase tracking-wide transition-colors ${activeLanguage === code ? 'bg-navy-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onClick={() => setActiveLanguage(code as any)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white p-6 shadow-sm border border-gray-100 space-y-6">
                        {/* Name Context */}
                        <div>
                            <label className="block text-sm font-medium text-navy-900 mb-2">
                                Neighborhood Name ({activeLanguage.toUpperCase()})
                            </label>
                            <input
                                type="text"
                                required={activeLanguage === 'en'}
                                className="w-full border border-gray-300 px-4 py-3 text-lg focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                value={activeLanguage === 'en' ? formData.name : ((formData as any)[`name_${activeLanguage}`] || '')}
                                onChange={(e) => {
                                    if (activeLanguage === 'en') {
                                        handleNameChange(e.target.value);
                                    } else {
                                        setFormData((prev) => ({ ...prev, [`name_${activeLanguage}`]: e.target.value }));
                                    }
                                }}
                                placeholder="e.g. Cap Cana"
                            />
                        </div>

                        {/* Description Context */}
                        <div>
                            <label className="block text-sm font-medium text-navy-900 mb-2">
                                Detailed Description ({activeLanguage.toUpperCase()})
                            </label>
                            <textarea
                                required={activeLanguage === 'en'}
                                rows={8}
                                className="w-full border border-gray-300 px-4 py-3 focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none resize-none font-mono text-sm"
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                value={activeLanguage === 'en' ? formData.description : ((formData as any)[`description_${activeLanguage}`] || '')}
                                onChange={(e) => {
                                    const key = activeLanguage === 'en' ? 'description' : `description_${activeLanguage}`;
                                    setFormData((prev) => ({ ...prev, [key]: e.target.value }));
                                }}
                                placeholder="Write the main neighborhood guide description here. HTML <p> tags are supported."
                                style={{ whiteSpace: 'pre-wrap' }}
                            />
                        </div>

                        {/* Highlights Management */}
                        <div className="border-t border-gray-100 pt-6">
                            <label className="block text-sm font-medium text-navy-900 mb-2">
                                Key Highlights ({activeLanguage.toUpperCase()})
                            </label>
                            <div className="flex space-x-2 mb-4">
                                <input
                                    type="text"
                                    className="flex-1 border border-gray-300 px-4 py-2 text-sm focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                    placeholder="e.g. Jack Nicklaus Signature Golf Course"
                                    value={newHighlight}
                                    onChange={(e) => setNewHighlight(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                                />
                                <button
                                    type="button"
                                    onClick={addHighlight}
                                    className="bg-navy-900 text-white px-4 py-2 hover:bg-navy-800 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <ul className="space-y-2">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {(((formData as any)[activeLanguage === 'en' ? 'highlights' : `highlights_${activeLanguage}`]) || []).map((highlight: string, index: number) => (
                                    <li key={index} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-sm border border-gray-100">
                                        <span className="text-sm text-gray-700">{highlight}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeHighlight(index)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </li>
                                ))}
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {(((formData as any)[activeLanguage === 'en' ? 'highlights' : `highlights_${activeLanguage}`]) || []).length === 0 && (
                                    <li className="text-sm text-gray-400 italic">No highlights added yet.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right Column: Meta & Media Settings */}
                <div className="space-y-6">
                    {/* Media Uploads */}
                    <div className="bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-light text-navy-900 mb-4 border-b pb-2">Hero Image</h3>
                        {formData.heroImage ? (
                            <div className="relative group aspect-video bg-gray-100 overflow-hidden mb-4">
                                <img src={formData.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-300 aspect-video flex flex-col items-center justify-center p-6 text-center hover:border-gold-500 transition-colors mb-4 bg-gray-50/50">
                                <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500 mb-4">Required 16:9 Landscape Cover</p>
                                <label className="cursor-pointer bg-navy-900 hover:bg-navy-800 text-white px-4 py-2 text-sm transition-colors">
                                    {uploadingImage ? 'Uploading...' : 'Browse Files'}
                                    <input
                                        type="file"
                                        accept="image/jpeg, image/png, image/webp"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                        disabled={uploadingImage}
                                    />
                                </label>
                            </div>
                        )}
                        <p className="text-xs text-gray-400">Recommended size: 1920x1080px for full-width hero sections.</p>
                    </div>

                    {/* SEO & Meta Settings */}
                    <div className="bg-white p-6 shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-lg font-light text-navy-900 mb-4 border-b pb-2">Properties Linking Meta</h3>

                        <div>
                            <label className="block text-sm font-medium text-navy-900 mb-1">URL / City Slug</label>
                            <input
                                type="text"
                                required
                                className="w-full border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none font-mono bg-gray-50"
                                value={formData.slug}
                                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                                placeholder="e.g. cap-cana"
                            />
                            <p className="text-xs text-gray-500 mt-1">This MUST exactly match the `citySlug` on your Property listings to auto-link them!</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-navy-900 mb-1">Average Price ($ USD)</label>
                            <input
                                type="number"
                                required
                                className="w-full border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                value={formData.averagePrice}
                                onChange={(e) => setFormData((prev) => ({ ...prev, averagePrice: Number(e.target.value) }))}
                                placeholder="e.g. 850000"
                            />
                        </div>

                        {/* Map Coordinates block could go here, omitting for brevity/clarity in MVP */}
                    </div>
                </div>

            </div>
        </form>
    );
}
