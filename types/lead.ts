export interface ILead {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    propertySlug?: string;
    createdAt?: string | Date;
}
