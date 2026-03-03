import PostForm from '../../PostForm';
import { getPostAdmin } from '../../actions';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: { id: string } }) {
    const post = await getPostAdmin(params.id);

    if (!post) {
        notFound();
    }

    return <PostForm initialData={post} />;
}
