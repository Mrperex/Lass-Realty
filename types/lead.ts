export interface ILead {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    propertySlug?: string;
    status: 'new' | 'contacted' | 'qualified' | 'closed';
    notes: { text: string; createdAt: Date }[];
    createdAt?: string | Date;
}
