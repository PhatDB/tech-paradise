import Image from 'next/image';
import {formatCurrency} from '@/lib/format';
import ProductDescription from './ProductDescription';
import ProductSpecs from './ProductSpecs';
import ProductReviewList from './ProductReviewList';
import AddToCartActions from './AddToCartActions';
import {ProductDetail} from '@/types/product';

interface Props {
    product: ProductDetail;
}

export default function ProductDetailView({product}: Props) {
    const mainImage = product.images.find(img => img.isMain) || product.images[0];
    const imageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${mainImage.imageUrl}`;
    const newPrice = product.price - (product.price * product.discount) / 100;

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                    <Image src={imageUrl} alt={product.productName} width={500} height={500}
                           className="rounded bg-gray-100"/>
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                    <h1 className="text-2xl font-bold">{product.productName}</h1>
                    <div className="text-xl text-red-600 font-semibold">
                        {product.discount > 0 ? (
                            <>
                                <span className="line-through text-gray-400 mr-2">{formatCurrency(product.price)}</span>
                                <span>{formatCurrency(newPrice)}</span>
                            </>
                        ) : (
                            <span>{formatCurrency(product.price)}</span>
                        )}
                    </div>
                    <AddToCartActions productId={product.productId}/>
                </div>
            </div>

            <ProductSpecs specs={product.productSpecs}/>
            <ProductDescription description={product.description}/>
            <ProductReviewList productId={product.productId}/>
        </div>
    );
}
