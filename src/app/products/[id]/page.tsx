import {notFound} from 'next/navigation';
import {ProductDetail} from '@/types/product';
import ProductDetailView from '@/components/product/ProductDetailView';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({params}: PageProps) {
    const {id} = await params;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/${id}`, {
        cache: 'no-store',
    });

    if (!res.ok) return notFound();

    const product: ProductDetail = await res.json();

    if (!product || !product.productId) return notFound();

    return <ProductDetailView product={product}/>;
}
