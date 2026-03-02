import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';
import EditPropertyForm from './EditPropertyForm';
import { notFound } from 'next/navigation';

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
    await connectToDatabase();

    let property;
    try {
        property = await Property.findById(params.id).lean();
    } catch (e) {
        // Invalid ID format will throw
        return notFound();
    }

    if (!property) {
        notFound();
    }

    return <EditPropertyForm property={JSON.parse(JSON.stringify(property))} />;
}
