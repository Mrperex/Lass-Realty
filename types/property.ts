export interface IProperty {
    _id?: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    city: string;
    citySlug: string;
    bedrooms: number;
    bathrooms: number;
    squareMeters: number;
    images: string[];
    featured: boolean;
    status: 'for-sale' | 'sold' | 'reserved';
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
