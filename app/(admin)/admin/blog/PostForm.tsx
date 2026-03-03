'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, updatePost } from './actions';
import { IPost } from '@/types/post';
import { Save, Loader2, ImagePlus, Trash2 } from 'lucide-react';

interface PostFormProps {
    initialData?: IPost;
}

export default function PostForm({ initialData }: PostFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeLanguage, setActiveLanguage] = useState<'en' | 'es'>('en');

    // Default empty state
    const [formData, setFormData] = useState<Partial<IPost>>(
        initialData || {
            title: '',
            title_es: '',
            slug: '',
            content: '',
            content_es: '',
            excerpt: '',
            excerpt_es: '',
            coverImage: '',
            author: 'LASS Realty Team',
            category: 'buying-guide',
            publishedAt: new Date(),
            featured: false,
        }
    );

    const isEditMode = !!initialData?._id;

    // Helper to generate slug from EN title if empty
    const handleTitleChange = (val: string) => {
        setFormData((prev) => {
            const updates = { ...prev, title: val };
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
                res = await updatePost(initialData._id, dataToSave);
            } else {
                res = await createPost(dataToSave);
            }

            if (res.success) {
                router.push('/admin/blog');
                router.refresh();
            } else {
                alert('Error explicitly saving post: ' + res.error);
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
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'lass_realty_admin');

            const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Cloudinary upload failed');

            const result = await res.json();
            setFormData((prev) => ({ ...prev, coverImage: result.secure_url }));
        } catch (error) {
            console.error('Image upload failed:', error);
            alert('Image upload failed to complete.');
        } finally {
            setUploadingImage(false);
        }
    };

    const removeImage = () => {
        setFormData((prev) => ({ ...prev, coverImage: '' }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-24">
            {/* Header Actions */}
            <div className="flex justify-between items-center bg-white p-6 shadow-sm sticky top-0 z-10 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl font-light text-navy-900">
                        {isEditMode ? 'Edit Blog Post' : 'Write New Post'}
                    </h1>
                </div>
                <div className="flex gap-4 items-center">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/blog')}
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
                        {isSubmitting ? 'Saving...' : 'Publish Post'}
                    </button>
                </div>
            </div>

            {/* Main Form Body */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6">

                {/* Left Column: Language & Content */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Language Tabs */}
                    <div className="bg-white p-1 rounded-none shadow-sm inline-flex mb-2 border border-gray-200">
                        <button
                            type="button"
                            className={`px-6 py-2 text-sm uppercase tracking-wide transition-colors ${activeLanguage === 'en' ? 'bg-navy-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                            onClick={() => setActiveLanguage('en')}
                        >
                            General English (EN)
                        </button>
                        <button
                            type="button"
                            className={`px-6 py-2 text-sm uppercase tracking-wide transition-colors ${activeLanguage === 'es' ? 'bg-navy-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                            onClick={() => setActiveLanguage('es')}
                        >
                            Spanish Translation (ES)
                        </button>
                    </div>

                    <div className="bg-white p-6 shadow-sm border border-gray-100 space-y-6">
                        {/* Title Context */}
                        <div>
                            <label className="block text-sm font-medium text-navy-900 mb-2">
                                Article Title ({activeLanguage.toUpperCase()})
                            </label>
                            <input
                                type="text"
                                required={activeLanguage === 'en'} // Only EN is strict required
                                className="w-full border border-gray-300 px-4 py-3 text-lg focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                value={activeLanguage === 'en' ? formData.title : formData.title_es}
                                onChange={(e) => {
                                    if (activeLanguage === 'en') {
                                        handleTitleChange(e.target.value);
                                    } else {
                                        setFormData((prev) => ({ ...prev, title_es: e.target.value }));
                                    }
                                }}
                                placeholder="e.g. 5 Reasons to Invest in Cap Cana..."
                            />
                        </div>

                        {/* Excerpt Context */}
                        <div>
                            <label className="block text-sm font-medium text-navy-900 mb-2">
                                Short Excerpt Summary ({activeLanguage.toUpperCase()})
                            </label>
                            <textarea
                                required={activeLanguage === 'en'}
                                rows={2}
                                className="w-full border border-gray-300 px-4 py-3 focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none resize-none"
                                value={activeLanguage === 'en' ? formData.excerpt : formData.excerpt_es}
                                onChange={(e) => {
                                    activeLanguage === 'en'
                                        ? setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                                        : setFormData((prev) => ({ ...prev, excerpt_es: e.target.value }));
                                }}
                                placeholder="A brief one-sentence summary for the blog directory preview cards."
                            />
                        </div>

                        {/* Rich Content Context */}
                        <div>
                            <label className="block text-sm font-medium text-navy-900 mb-2">
                                Full Article Body ({activeLanguage.toUpperCase()})
                            </label>
                            <textarea
                                required={activeLanguage === 'en'}
                                rows={15}
                                className="w-full border border-gray-300 px-4 py-3 focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none font-mono text-sm"
                                value={activeLanguage === 'en' ? formData.content : formData.content_es}
                                onChange={(e) => {
                                    activeLanguage === 'en'
                                        ? setFormData((prev) => ({ ...prev, content: e.target.value }))
                                        : setFormData((prev) => ({ ...prev, content_es: e.target.value }));
                                }}
                                placeholder="Write the main article content here. You can use standard HTML like <h2> or <p> for formatting."
                                style={{ whiteSpace: 'pre-wrap' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Meta & Media Settings */}
                <div className="space-y-6">
                    {/* Media Uploads */}
                    <div className="bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-light text-navy-900 mb-4 border-b pb-2">Cover Image</h3>
                        {formData.coverImage ? (
                            <div className="relative group aspect-video bg-gray-100 overflow-hidden mb-4">
                                <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
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
                        <p className="text-xs text-gray-400">Recommended size: 1200x630px. WebP formats are optimally compressed for the Edge.</p>
                    </div>

                    {/* SEO & Meta Settings */}
                    <div className="bg-white p-6 shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-lg font-light text-navy-900 mb-4 border-b pb-2">Publishing Meta</h3>

                        <div>
                            <label className="block text-sm font-medium text-navy-900 mb-1">URL Slug</label>
                            <input
                                type="text"
                                required
                                className="w-full border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none font-mono bg-gray-50"
                                value={formData.slug}
                                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                                placeholder="e.g. cap-cana-investment"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-navy-900 mb-1">Author Name</label>
                            <input
                                type="text"
                                required
                                className="w-full border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none"
                                value={formData.author}
                                onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-navy-900 mb-1">Category Route</label>
                            <select
                                required
                                className="w-full border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none bg-white"
                                value={formData.category}
                                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as any }))}
                            >
                                <option value="buying-guide">Buying Guide</option>
                                <option value="market-update">Market Update</option>
                                <option value="lifestyle">Lifestyle & Living</option>
                                <option value="news">Corporate News</option>
                            </select>
                        </div>

                        <div className="pt-4 mt-2 border-t border-gray-100">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 text-gold-500 border-gray-300 rounded focus:ring-gold-500"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                                />
                                <span className="text-navy-900 font-medium">Pin as Featured Post</span>
                            </label>
                            <p className="text-xs text-gray-500 ml-8 mt-1">Featured posts appear dynamically in the homepage hero slider or dedicated magazine highlights.</p>
                        </div>

                    </div>
                </div>

            </div>
        </form>
    );
}
