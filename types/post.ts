export interface IPost {
    _id?: string;
    title: string;
    title_es?: string;
    slug: string;
    content: string;
    content_es?: string;
    excerpt: string;
    excerpt_es?: string;
    coverImage?: string;
    author: string;
    category: 'market-update' | 'buying-guide' | 'lifestyle' | 'news';
    publishedAt: Date;
    featured: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
