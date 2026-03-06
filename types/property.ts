export interface IProperty {
    _id?: string;
    title: string;
    title_es?: string;
    title_fr?: string;
    title_it?: string;
    title_de?: string;
    title_ru?: string;
    title_ht?: string;
    slug: string;
    description: string;
    description_es?: string;
    description_fr?: string;
    description_it?: string;
    description_de?: string;
    description_ru?: string;
    description_ht?: string;
    price: number;
    city: string;
    city_es?: string;
    city_fr?: string;
    city_it?: string;
    city_de?: string;
    city_ru?: string;
    city_ht?: string;
    citySlug: string;
    bedrooms: number;
    bathrooms: number;
    squareMeters: number;
    images: string[];
    featured: boolean;
    status: 'for-sale' | 'sold' | 'reserved' | 'for-rent' | 'rented';
    deposit?: number;
    maintenanceFee?: number;
    rentPeriod?: 'monthly' | 'nightly';
    pool?: boolean;
    oceanView?: boolean;
    golfView?: boolean;
    furnished?: boolean;
    petFriendly?: boolean;
    amenities?: string[];
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
    agentId?: string | any; // Type as appropriate, e.g. Schema.Types.ObjectId or IAgent
}
