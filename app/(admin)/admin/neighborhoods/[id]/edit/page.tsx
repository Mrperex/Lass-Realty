import NeighborhoodForm from '../../NeighborhoodForm';
import { getNeighborhoodAdmin } from '../../actions';
import { notFound } from 'next/navigation';

export default async function EditNeighborhoodPage({ params }: { params: { id: string } }) {
    const neighborhood = await getNeighborhoodAdmin(params.id);

    if (!neighborhood) {
        notFound();
    }

    return <NeighborhoodForm initialData={neighborhood} />;
}
