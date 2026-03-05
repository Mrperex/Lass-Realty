'use client';

import { useState, useRef } from 'react';
import { updateProperty } from '../../actions';
import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { ArrowLeft, Save, UploadCloud, X } from 'lucide-react';
import { LOCATIONS } from '@/lib/locations';

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
            {pending ? 'Saving...' : 'Save Changes'}
        </button>
    );
}

export default function EditPropertyForm({ property }: { property: any }) {
    const updateAction = updateProperty.bind(null, property._id);
    const [state, formAction] = useFormState(updateAction, initialState);

    // Initialize with existing images
    const [imageUrls, setImageUrls] = useState<string[]>(property.images || []);
    const [uploadingImages, setUploadingImages] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [floorPlanUrls, setFloorPlanUrls] = useState<string[]>(property.floorPlans || []);
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
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Property</h1>
                    <p className="text-slate-500 mt-1">Updating {property.title}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <form action={formAction} className="p-8 space-y-8">
                    {state?.error && (
                        <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-xl text-sm font-medium">
                            {state.error}
                        </div>
                    )}

                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Property Title (English)</label>
                                <input type="text" id="title" name="title" defaultValue={property.title} required className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow" />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="title_es" className="block text-sm font-medium text-slate-700 mb-1">Property Title (Spanish) — Optional</label>
                                <input type="text" id="title_es" name="title_es" defaultValue={property.title_es} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow bg-amber-50/10" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-navy-800 tracking-wider mb-2">Matterport / 3D Virtual Tour URL (Optional)</label>
                                <input
                                    type="url"
                                    name="virtualTourUrl"
                                    defaultValue={property.virtualTourUrl || ''}
                                    placeholder="https://my.matterport.com/show/?m=..."
                                    className="w-full px-5 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-champagne-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 font-outfit"
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

                            <div className="md:col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description (English)</label>
                                <textarea id="description" name="description" defaultValue={property.description} rows={5} required className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow" />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="description_es" className="block text-sm font-medium text-slate-700 mb-1">Description (Spanish) — Optional</label>
                                <textarea id="description_es" name="description_es" defaultValue={property.description_es} rows={5} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow bg-amber-50/10" />
                            </div>

                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">Price (USD)</label>
                                <input type="number" id="price" name="price" defaultValue={property.price} required min="0" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow" />
                            </div>

                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1">Location City (English)</label>
                                <select id="city" name="city" defaultValue={property.city} required className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow bg-white">
                                    <option value="">Select a City</option>
                                    {LOCATIONS.map((loc: { slug: string, name: string }) => (
                                        <option key={loc.slug} value={loc.name}>{loc.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="city_es" className="block text-sm font-medium text-slate-700 mb-1">Location City (Spanish)</label>
                                <input type="text" id="city_es" name="city_es" defaultValue={property.city_es} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow bg-amber-50/10" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Property Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="bedrooms" className="block text-sm font-medium text-slate-700 mb-1">Bedrooms</label>
                                <input type="number" id="bedrooms" name="bedrooms" defaultValue={property.bedrooms} required min="0" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow" />
                            </div>

                            <div>
                                <label htmlFor="bathrooms" className="block text-sm font-medium text-slate-700 mb-1">Bathrooms</label>
                                <input type="number" id="bathrooms" name="bathrooms" defaultValue={property.bathrooms} required min="0" step="0.5" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow" />
                            </div>

                            <div>
                                <label htmlFor="squareMeters" className="block text-sm font-medium text-slate-700 mb-1">Square Meters</label>
                                <input type="number" id="squareMeters" name="squareMeters" defaultValue={property.squareMeters} required min="0" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow" />
                            </div>
                        </div>
                    </div>

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
                            </div>

                            {imageUrls.map((url, idx) => (
                                <input key={`img-hidden-${idx}`} type="hidden" name="images" value={url} />
                            ))}

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

                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Status & Presentation</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <select id="status" name="status" defaultValue={property.status || 'for-sale'} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow bg-white">
                                    <option value="for-sale">For Sale</option>
                                    <option value="for-rent">For Rent</option>
                                    <option value="reserved">Reserved / Pending</option>
                                    <option value="sold">Sold</option>
                                    <option value="rented">Rented</option>
                                </select>
                            </div>
                            <div className="flex items-center pt-8">
                                <div className="flex items-center h-5">
                                    <input id="featured" name="featured" type="checkbox" defaultChecked={property.featured} className="w-5 h-5 text-amber-600 border-slate-300 rounded focus:ring-amber-500" />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="featured" className="font-medium text-slate-900">Featured Property</label>
                                    <p className="text-slate-500">Show this property on the homepage.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Property Amenities</h4>

                            <div className="space-y-8">
                                {/* Infrastructure */}
                                <div>
                                    <h5 className="text-xs font-bold text-amber-600 mb-3 tracking-widest uppercase">Infrastructure</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
                                        {['Backup Generator', 'Water System / Cistern', 'Water Heater', 'Fiber Optic Internet', 'Underground Cabling'].map((amenity) => (
                                            <div key={amenity} className="flex items-center">
                                                <input
                                                    id={`amenity-${amenity}`}
                                                    name="amenities[]"
                                                    value={amenity}
                                                    type="checkbox"
                                                    defaultChecked={(property.amenities || []).includes(amenity)}
                                                    className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                                                />
                                                <label htmlFor={`amenity-${amenity}`} className="ml-3 text-sm font-medium text-slate-700">{amenity}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Security */}
                                <div>
                                    <h5 className="text-xs font-bold text-amber-600 mb-3 tracking-widest uppercase">Security</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
                                        {['24/7 Security', 'Gated Community', 'Surveillance Cameras', 'Controlled Access', 'Smart Lock'].map((amenity) => (
                                            <div key={amenity} className="flex items-center">
                                                <input
                                                    id={`amenity-${amenity}`}
                                                    name="amenities[]"
                                                    value={amenity}
                                                    type="checkbox"
                                                    defaultChecked={(property.amenities || []).includes(amenity)}
                                                    className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                                                />
                                                <label htmlFor={`amenity-${amenity}`} className="ml-3 text-sm font-medium text-slate-700">{amenity}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Outdoor / Leisure */}
                                <div>
                                    <h5 className="text-xs font-bold text-amber-600 mb-3 tracking-widest uppercase">Outdoor & Leisure</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
                                        {['Private Pool', 'Infinity Pool', 'Artificial Beach', 'Jacuzzi', 'BBQ Area', 'Gazebo', 'Wrap Around Balcony', 'Ocean Front', 'Ocean View', 'Golf View'].map((amenity) => (
                                            <div key={amenity} className="flex items-center">
                                                <input
                                                    id={`amenity-${amenity}`}
                                                    name="amenities[]"
                                                    value={amenity}
                                                    type="checkbox"
                                                    defaultChecked={(property.amenities || []).includes(amenity)}
                                                    className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                                                />
                                                <label htmlFor={`amenity-${amenity}`} className="ml-3 text-sm font-medium text-slate-700">{amenity}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Community / Shared */}
                                <div>
                                    <h5 className="text-xs font-bold text-amber-600 mb-3 tracking-widest uppercase">Community & Shared</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
                                        {['Club House', 'Basketball Court', 'Tennis / Padel Court', 'Kids Playground', 'Gym', 'Co-working Space'].map((amenity) => (
                                            <div key={amenity} className="flex items-center">
                                                <input
                                                    id={`amenity-${amenity}`}
                                                    name="amenities[]"
                                                    value={amenity}
                                                    type="checkbox"
                                                    defaultChecked={(property.amenities || []).includes(amenity)}
                                                    className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                                                />
                                                <label htmlFor={`amenity-${amenity}`} className="ml-3 text-sm font-medium text-slate-700">{amenity}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Interior / Luxury */}
                                <div>
                                    <h5 className="text-xs font-bold text-amber-600 mb-3 tracking-widest uppercase">Interior & Luxury</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
                                        {['Wine Cellar', 'Smart Home Integration', "Maid's Quarters", 'Central AC', 'Elevator', 'Fully Furnished', 'Pet Friendly'].map((amenity) => (
                                            <div key={amenity} className="flex items-center">
                                                <input
                                                    id={`amenity-${amenity}`}
                                                    name="amenities[]"
                                                    value={amenity}
                                                    type="checkbox"
                                                    defaultChecked={(property.amenities || []).includes(amenity)}
                                                    className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                                                />
                                                <label htmlFor={`amenity-${amenity}`} className="ml-3 text-sm font-medium text-slate-700">{amenity}</label>
                                            </div>
                                        ))}
                                    </div>
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
