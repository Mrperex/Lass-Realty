export interface INeighborhood {
    _id?: string;
    name: string;
    name_es?: string;
    name_fr?: string;
    name_it?: string;
    name_de?: string;
    name_ru?: string;
    name_ht?: string;
    slug: string;
    description: string;
    description_es?: string;
    description_fr?: string;
    description_it?: string;
    description_de?: string;
    description_ru?: string;
    description_ht?: string;
    heroImage?: string;
    gallery: string[];
    highlights: string[];
    highlights_es?: string[];
    highlights_fr?: string[];
    highlights_it?: string[];
    highlights_de?: string[];
    highlights_ru?: string[];
    highlights_ht?: string[];
    mapCoordinates?: {
        lat: number;
        lng: number;
    };
    averagePrice?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
