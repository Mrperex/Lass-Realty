export interface INeighborhood {
    _id?: string;
    name: string;
    name_es?: string;
    slug: string;
    description: string;
    description_es?: string;
    heroImage?: string;
    gallery: string[];
    highlights: string[];
    highlights_es?: string[];
    mapCoordinates?: {
        lat: number;
        lng: number;
    };
    averagePrice?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
