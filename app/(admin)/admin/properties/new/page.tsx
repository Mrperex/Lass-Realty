'use client';

import { useState, useRef } from 'react';
import { createProperty } from '../actions';
import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { ArrowLeft, Save, UploadCloud, X } from 'lucide-react';
import { LOCATIONS } from '@/lib/locations';
import AmenitiesMultiSelect from '@/components/admin/AmenitiesMultiSelect';

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

const LOCALES = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'it', label: 'Italian' },
    { code: 'de', label: 'German' },
    { code: 'ru', label: 'Russian' },
    { code: 'ht', label: 'Creole' }
];

export default function NewPropertyPage() {
    const [state, formAction] = useFormState(createProperty, initialState);
    const [status, setStatus] = useState('for-sale');
    const [activeTab, setActiveTab] = useState('en');
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [floorPlanUrls, setFloorPlanUrls] = useState<string[]>([]);
    const [uploadingFloorPlans, setUploadingFloorPlans] = useState(false);
    const floorPlanInputRef = useRef<HTMLInputElement>(null);

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

    const handleFloorPlanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingFloorPlans(true);

        try {
            const timestamp = Math.round((new Date()).getTime() / 1000);
            const sigRes = await fetch('/api/admin/cloudinary-sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paramsToSign: { timestamp } })
            });

            if (!sigRes.ok) throw new Error('Failed to get upload signature');
            const { signature, apiKey, cloudName } = await sigRes.json();

            const uploadedUrls: string[] = [];

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

            setFloorPlanUrls(prev => [...prev, ...uploadedUrls]);

        } catch (error) {
            console.error("Floor plan upload error:", error);
            alert("Failed to upload floor plans.");
        } finally {
            setUploadingFloorPlans(false);
            if (floorPlanInputRef.current) floorPlanInputRef.current.value = '';
        }
    };

    const removeFloorPlan = (indexToRemove: number) => {
        setFloorPlanUrls(prev => prev.filter((_, idx) => idx !== indexToRemove));
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

                        <div className="mb-6 border-b border-slate-200">
                            <div className="flex gap-4 overflow-x-auto pb-px">
                                {LOCALES.map((l) => (
                                    <button
                                        key={l.code}
                                        type="button"
                                        onClick={() => setActiveTab(l.code)}
                                        className={`whitespace-nowrap py-3 mx-1 font-medium text-sm transition-colors border-b-2 ${activeTab === l.code ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                                    >
                                        {l.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {LOCALES.map((l) => (
                                <div key={`tab-${l.code}`} className={activeTab === l.code ? 'contents' : 'hidden'}>
                                    <div className="md:col-span-2">
                                        <label htmlFor={l.code === 'en' ? 'title' : `title_${l.code}`} className="block text-sm font-medium text-slate-700 mb-1">
                                            Property Title ({l.label}) {l.code === 'en' && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            type="text"
                                            id={l.code === 'en' ? 'title' : `title_${l.code}`}
                                            name={l.code === 'en' ? 'title' : `title_${l.code}`}
                                            required={l.code === 'en'}
                                            className={`w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow ${l.code !== 'en' ? 'bg-amber-50/10' : ''}`}
                                            placeholder={l.code === 'en' ? 'e.g. Modern Beachfront Villa in Cap Cana' : `Title in ${l.label}...`}
                                        />
                                        {l.code === 'en' && <p className="text-xs text-slate-500 mt-1.5">Slug will be auto-generated from this title.</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor={l.code === 'en' ? 'description' : `description_${l.code}`} className="block text-sm font-medium text-slate-700 mb-1">
                                            Description ({l.label}) {l.code === 'en' && <span className="text-red-500">*</span>}
                                        </label>
                                        <textarea
                                            id={l.code === 'en' ? 'description' : `description_${l.code}`}
                                            name={l.code === 'en' ? 'description' : `description_${l.code}`}
                                            rows={5}
                                            required={l.code === 'en'}
                                            className={`w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow ${l.code !== 'en' ? 'bg-amber-50/10' : ''}`}
                                            placeholder={`Describe the property in ${l.label}...`}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor={l.code === 'en' ? 'city' : `city_${l.code}`} className="block text-sm font-medium text-slate-700 mb-1">
                                            Location City ({l.label}) {l.code === 'en' && <span className="text-red-500">*</span>}
                                        </label>
                                        {l.code === 'en' ? (
                                            <select
                                                id="city"
                                                name="city"
                                                required
                                                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow bg-white"
                                            >
                                                <option value="">Select a City</option>
                                                {LOCATIONS.map((loc) => (
                                                    <option key={loc.slug} value={loc.name}>{loc.name}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                id={`city_${l.code}`}
                                                name={`city_${l.code}`}
                                                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow bg-amber-50/10"
                                                placeholder={`City in ${l.label}...`}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}

                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">Price (USD)</label>
                                <input type="number" id="price" name="price" required min="0" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow bg-white" placeholder="e.g. 1500000" />
                            </div>

                            <div className="md:col-span-2 border-t border-slate-100 pt-6 mt-2">
                                <label className="block text-sm font-bold text-navy-800 tracking-wider mb-2">Matterport / 3D Virtual Tour URL (Optional)</label>
                                <input
                                    type="url"
                                    name="virtualTourUrl"
                                    placeholder="https://my.matterport.com/show/?m=..."
                                    className="w-full px-5 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-champagne-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 font-outfit bg-white"
                                />
                            </div>

                            <div className="md:col-span-2 border-t border-slate-100 pt-6">
                                <label className="block text-sm font-bold text-navy-800 tracking-wider mb-2">Interactive Floor Plans / Blueprints (Optional)</label>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => floorPlanInputRef.current?.click()}
                                            disabled={uploadingFloorPlans}
                                            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl bg-slate-50 text-slate-700 font-medium hover:bg-slate-100 transition-colors disabled:opacity-50"
                                        >
                                            <UploadCloud className="w-5 h-5" />
                                            {uploadingFloorPlans ? 'Uploading Diagram...' : 'Upload Floor Plans'}
                                        </button>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            ref={floorPlanInputRef}
                                            onChange={handleFloorPlanUpload}
                                        />
                                    </div>

                                    {/* Hidden inputs to pass URL strings to server action */}
                                    {floorPlanUrls.map((url, idx) => (
                                        <input key={`fp-hidden-${idx}`} type="hidden" name="floorPlans" value={url} />
                                    ))}

                                    {/* Floor Plan Previews */}
                                    {floorPlanUrls.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-6">
                                            {floorPlanUrls.map((url, idx) => (
                                                <div key={`fp-${idx}`} className="relative aspect-[4/3] rounded-xl overflow-hidden group border border-slate-200 bg-white">
                                                    <img src={url} alt="Floor Plan Preview" className="w-full h-full object-contain p-2" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFloorPlan(idx)}
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
                                <select id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow bg-white">
                                    <option value="for-sale">For Sale</option>
                                    <option value="for-rent">For Rent</option>
                                    <option value="reserved">Reserved / Pending</option>
                                    <option value="sold">Sold</option>
                                    <option value="rented">Rented</option>
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

                        {status === 'for-rent' && (
                            <div className="pt-6 border-t border-slate-100">
                                <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Rental Specifics</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label htmlFor="rentPeriod" className="block text-sm font-medium text-slate-700 mb-1">Rent Period</label>
                                        <select id="rentPeriod" name="rentPeriod" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow bg-white">
                                            <option value="">Select Period</option>
                                            <option value="monthly">Monthly (/mo)</option>
                                            <option value="nightly">Nightly (/night)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="deposit" className="block text-sm font-medium text-slate-700 mb-1">Security Deposit (USD)</label>
                                        <input type="number" id="deposit" name="deposit" min="0" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow" placeholder="e.g. 2000" />
                                    </div>
                                    <div>
                                        <label htmlFor="maintenanceFee" className="block text-sm font-medium text-slate-700 mb-1">Maintenance Fee (USD)</label>
                                        <input type="number" id="maintenanceFee" name="maintenanceFee" min="0" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow" placeholder="e.g. 150" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-6 border-t border-slate-100">
                            <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Property Amenities</h4>
                            <AmenitiesMultiSelect />
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
