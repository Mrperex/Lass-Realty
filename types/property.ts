export interface IProperty {
    _id?: string;
    title: string;
    title_es?: string;
    slug: string;
    description: string;
    description_es?: string;
    price: number;
    city: string;
    city_es?: string;
    citySlug: string;
    bedrooms: number;
    bathrooms: number;
    squareMeters: number;
    images: string[];
    featured: boolean;
    status: 'for-sale' | 'sold' | 'reserved' | 'for-rent' | 'rented';
    pool?: boolean;
    oceanView?: boolean;
    golfView?: boolean;
    furnished?: boolean;
    petFriendly?: boolean;
    type?: 'villa' | 'condo' | 'penthouse' | 'land';
    virtualTourUrl?: string;
    videoTourUrl?: string;
    floorPlans?: string[];
    priceHistory?: {
        date: string | Date;
        price: number;
        event: 'listed' | 'reduced' | 'increased';
    }[];
    photosVerifiedAt?: string | Date;
    coordinates?: {
        lat: number;
        lng: number;
    };
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
