
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 60;

// Simple markdown-to-HTML converter for blog content
function markdownToHtml(text: string): string {
    if (!text) return '';
    return text
        // Convert **bold** to <strong>
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Convert *italic* to <em>
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Convert markdown headers
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        // Convert markdown bullet lists
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        // Wrap consecutive <li> items in <ul>
        .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
        // Convert double newlines into paragraph breaks
        .split('\n\n')
        .map(block => {
            const trimmed = block.trim();
            if (!trimmed) return '';
            // Don't wrap if it's already an HTML element
            if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<ol')) {
                return trimmed;
            }
            return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
        })
        .join('\n');
}

// Dynamic SEO metadata
export async function generateMetadata({
    params: { locale, slug }
}: {
    params: { locale: string; slug: string }
}): Promise<Metadata> {
    await connectToDatabase();
    const post = await Post.findOne({ slug }).lean();
    if (!post) return {};

    const p = JSON.parse(JSON.stringify(post));
    const title = (locale === 'es' && p.title_es) ? p.title_es : p.title;
    const description = (locale === 'es' && p.excerpt_es) ? p.excerpt_es : p.excerpt;

    return {
        title: `${title} | LASS Realty`,
        description,
        openGraph: {
            title,
            description,
            images: p.coverImage ? [{ url: p.coverImage }] : [],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

export default async function BlogPostPage({
    params: { locale, slug }
}: {
    params: { locale: string; slug: string }
}) {
    await connectToDatabase();
    const rawPost = await Post.findOne({ slug }).lean();
    if (!rawPost) notFound();

    const post = JSON.parse(JSON.stringify(rawPost));

    // Bilingual getters
    const title = (locale === 'es' && post.title_es) ? post.title_es : post.title;
    const rawContent = (locale === 'es' && post.content_es) ? post.content_es : post.content;
    const htmlContent = markdownToHtml(rawContent);

    // Related posts (same category, excluding current)
    const rawRelated = await Post.find({ category: post.category, slug: { $ne: slug } })
        .sort({ publishedAt: -1 })
        .limit(3)
        .lean();
    const relatedPosts = JSON.parse(JSON.stringify(rawRelated));

    return (
        <main className="min-h-screen bg-white pt-28 pb-24">
            {/* Hero Section */}
            {post.coverImage && (
                <div className="relative w-full h-[50vh] md:h-[60vh] mb-12">
                    <Image
                        src={post.coverImage}
                        alt={title}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-5xl mx-auto">
                        <span className="inline-block bg-gold-500 text-white text-xs font-semibold tracking-wider uppercase px-4 py-1.5 mb-4 font-outfit">
                            {post.category?.replace('-', ' ')}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-playfair font-medium text-white leading-tight mb-4">
                            {title}
                        </h1>
                        <div className="flex items-center space-x-6 text-white/80 text-sm font-outfit">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(post.publishedAt).toLocaleDateString(locale === 'es' ? 'es-DO' : 'en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </div>
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                {post.author}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Article Body */}
            <article className="max-w-3xl mx-auto px-6 lg:px-0">
                {!post.coverImage && (
                    <div className="mb-12">
                        <span className="inline-block bg-navy-900 text-white text-xs font-semibold tracking-wider uppercase px-4 py-1.5 mb-6 font-outfit">
                            {post.category?.replace('-', ' ')}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-playfair font-medium text-navy-900 leading-tight mb-4">
                            {title}
                        </h1>
                        <div className="flex items-center space-x-6 text-gray-500 text-sm font-outfit">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(post.publishedAt).toLocaleDateString(locale === 'es' ? 'es-DO' : 'en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </div>
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                {post.author}
                            </div>
                        </div>
                    </div>
                )}

                {/* Content — rendered as HTML from markdown */}
                <div
                    className="max-w-none font-outfit text-gray-700 text-lg leading-relaxed
                        [&_h1]:font-playfair [&_h1]:text-[#0a1128] [&_h1]:text-3xl [&_h1]:font-medium [&_h1]:mt-8 [&_h1]:mb-4
                        [&_h2]:font-playfair [&_h2]:text-[#0a1128] [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:mt-8 [&_h2]:mb-4
                        [&_h3]:font-playfair [&_h3]:text-[#0a1128] [&_h3]:text-xl [&_h3]:font-medium [&_h3]:mt-6 [&_h3]:mb-3
                        [&_p]:mb-4 [&_p]:text-gray-700
                        [&_strong]:text-[#0a1128] [&_strong]:font-semibold
                        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2
                        [&_li]:text-gray-700
                        [&_a]:text-blue-600 [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />

                {/* Back to blog */}
                <div className="flex items-center justify-between mt-16 pt-8 border-t border-gray-200">
                    <Link
                        href={`/${locale}/blog`}
                        className="flex items-center text-navy-900 hover:text-gold-500 transition-colors font-outfit text-sm font-semibold uppercase tracking-wider"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {locale === 'es' ? 'Volver al Blog' : 'Back to Blog'}
                    </Link>
                </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-24">
                    <h2 className="text-2xl md:text-3xl font-playfair font-medium text-navy-900 mb-8">
                        {locale === 'es' ? 'Artículos Relacionados' : 'Related Articles'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {relatedPosts.map((related: any) => {
                            const rTitle = (locale === 'es' && related.title_es) ? related.title_es : related.title;
                            return (
                                <Link
                                    key={related._id}
                                    href={`/${locale}/blog/${related.slug}`}
                                    className="group bg-slate-50 border border-gray-100 hover:shadow-md transition-shadow"
                                >
                                    {related.coverImage && (
                                        <div className="relative aspect-[16/9] overflow-hidden">
                                            <Image
                                                src={related.coverImage}
                                                alt={rTitle}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />
                                        </div>
                                    )}
                                    <div className="p-5">
                                        <h3 className="font-playfair text-lg font-medium text-navy-900 group-hover:text-gold-500 transition-colors line-clamp-2">
                                            {rTitle}
                                        </h3>
                                        <p className="text-xs text-gray-500 font-outfit mt-2">
                                            {new Date(related.publishedAt).toLocaleDateString(locale === 'es' ? 'es-DO' : 'en-US', {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}
        </main>
    );
}
