import { getTranslations } from 'next-intl/server';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';

export const revalidate = 60; // Revalidate cache every 60 seconds

export default async function BlogIndexPage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    // locale obtained from params directly

    await connectToDatabase();
    // Fetch all posts, sort by newest
    const rawPosts = await Post.find().sort({ publishedAt: -1 }).lean();

    // Parse to plain JSON to pass from Server Component
    const posts = JSON.parse(JSON.stringify(rawPosts));

    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="max-w-3xl mb-16">
                    <h1 className="text-4xl md:text-5xl font-cormorant font-medium text-navy-900 mb-6">
                        {locale === 'es' ? 'Noticias y Mercado' : 'Market Insights & News'}
                    </h1>
                    <p className="text-lg text-gray-600 font-outfit">
                        {locale === 'es'
                            ? 'Descubra las últimas tendencias del mercado inmobiliario, guías de compra de lujo y actualizaciones exclusivas de República Dominicana.'
                            : 'Discover the latest real estate market trends, luxury buying guides, and exclusive updates from the Dominican Republic.'}
                    </p>
                </div>

                {/* Grid */}
                {posts.length === 0 ? (
                    <div className="text-center py-20 bg-white shadow-sm border border-gray-100">
                        <p className="text-gray-500 font-outfit">
                            {locale === 'es' ? 'No hay artículos publicados todavía.' : 'No articles published yet.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post: any) => {
                            // Bilingual getters
                            const title = (locale === 'es' && post.title_es) ? post.title_es : post.title;
                            const excerpt = (locale === 'es' && post.excerpt_es) ? post.excerpt_es : post.excerpt;

                            return (
                                <Link
                                    href={`/${locale}/blog/${post.slug}`}
                                    key={post._id}
                                    className="group bg-white flex flex-col h-full shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                                >
                                    {/* Cover Image */}
                                    <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                                        {post.coverImage ? (
                                            <Image
                                                src={post.coverImage}
                                                alt={title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-outfit text-sm">
                                                No Image
                                            </div>
                                        )}
                                        {/* Category Badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-navy-900/90 backdrop-blur-sm text-white text-xs font-semibold tracking-wider uppercase px-3 py-1 font-outfit">
                                                {post.category?.replace('-', ' ')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center space-x-4 text-xs text-gray-500 font-outfit mb-4">
                                            <div className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {new Date(post.publishedAt).toLocaleDateString(locale === 'es' ? 'es-DO' : 'en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                            <div className="flex items-center">
                                                <User className="w-3 h-3 mr-1" />
                                                {post.author}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-cormorant font-medium text-navy-900 mb-3 group-hover:text-gold-500 transition-colors line-clamp-2">
                                            {title}
                                        </h3>

                                        <p className="text-gray-600 font-outfit text-sm line-clamp-3 mb-6 flex-1">
                                            {excerpt}
                                        </p>

                                        <div className="flex items-center text-sm font-semibold text-gold-500 font-outfit tracking-wide uppercase mt-auto group-hover:text-gold-600 transition-colors">
                                            {locale === 'es' ? 'Leer Más' : 'Read Article'}
                                            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
