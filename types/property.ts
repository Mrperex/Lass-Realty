export interface IProperty {
    _id?: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    city: string;
    bedrooms: number;
    bathrooms: number;
    images: string[];
    featured: boolean;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
