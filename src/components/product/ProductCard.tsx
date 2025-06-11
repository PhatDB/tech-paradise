'use client';

import Image from 'next/image';
import Link from 'next/link';
import {Product} from '@/types/product';
import {formatCurrency} from '@/lib/format';
import {StarRating} from '@/components/product/StarRating';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({product}: ProductCardProps) {
    const newPrice = product.price - (product.price * product.discount) / 100;
    const imageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.imageUrl}`;

    return (
        <Link href={`/products/${product.id}`}
              className="bg-white rounded-lg border hover:shadow-md transition block p-3">
            <div className="relative w-full h-48 mb-3">
                <Image
                    src={imageUrl}
                    alt={product.productName}
                    fill
                    sizes="(max-width: 768px) 100vw, 20vw"
                    className="object-contain rounded"
                />
            </div>

            <h3 className="text-sm font-semibold line-clamp-2 mb-1">{product.productName}</h3>

            <div className="flex items-center text-sm mb-2">
                <StarRating rating={product.rating}/>
                <span className="text-xs text-gray-500 ml-2">({product.rating.toFixed(1)})</span>
            </div>

            <div className="flex flex-wrap gap-1 text-xs mb-2">
                {product.specs.split(',').slice(0, 3).map((spec, idx) => (
                    <span key={idx} className="bg-gray-100 px-2 py-1 rounded text-gray-700">{spec.trim()}</span>
                ))}
            </div>

            <div className="text-sm">
                {product.discount > 0 ? (
                    <>
                        <span className="line-through text-gray-400 mr-2">{formatCurrency(product.price)}</span>
                        <span className="text-red-600 font-semibold">{formatCurrency(newPrice)}</span>
                        <span
                            className="ml-2 text-red-600 border border-red-600 px-1.5 py-0.5 text-xs rounded font-semibold">
                            -{product.discount}%
                        </span>
                    </>
                ) : (
                    <span className="text-black font-semibold">{formatCurrency(product.price)}</span>
                )}
            </div>
        </Link>
    );
}
