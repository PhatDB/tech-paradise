import {notFound} from 'next/navigation';
import {ProductDetail} from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';
import {formatCurrency} from '@/lib/format';
import {ArrowLeft} from 'lucide-react';
import {StarRating} from '@/components/product/StarRating';
import ReviewForm from '@/components/product/ReviewForm';
import ProductDescription from '@/components/product/ProductDescription';
import QuantitySelector from '@/components/product/QuantitySelector';

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

    const mainImage = product.images.find((img) => img.isMain) || product.images[0];
    const imageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${mainImage?.imageUrl}`;
    const newPrice = product.price - (product.price * product.discount) / 100;
    const ratings = product.productReviews.flatMap((r) => r.reviews.map((rv) => rv.rating));
    const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

    return (
        <div className="container mx-auto p-3">
            <Link
                href="/"
                className="inline-flex items-center gap-1 text-gray-600 hover:text-primary transition text-sm font-medium mb-4"
            >
                <ArrowLeft className="w-4 h-4"/>
                <span>Về trang chủ</span>
            </Link>

            <div className="mt-4 flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                    <Image
                        src={imageUrl}
                        alt={product.productName}
                        width={500}
                        height={500}
                        className="rounded object-contain bg-gray-100"
                    />
                </div>

                <div className="w-full md:w-1/2 space-y-4">
                    <h1 className="text-2xl font-bold text-gray-800">{product.productName}</h1>
                    <div className="flex items-center gap-2">
                        <StarRating rating={averageRating}/>
                        <span className="text-sm text-gray-500">({averageRating.toFixed(1)})</span>
                    </div>
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

                    <div className="flex items-center gap-4">
                        <QuantitySelector/>
                        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Mua ngay</button>
                        <button className="border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-50">Thêm
                            vào giỏ
                        </button>
                    </div>
                </div>
            </div>

            {product.productSpecs?.length > 0 && (
                <div className="mt-10 bg-white rounded-md p-4 shadow">
                    <h2 className="text-xl font-semibold mb-4 uppercase text-gray-800">Thông số kỹ thuật</h2>
                    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                        <table className="w-full text-sm text-left text-gray-700 bg-white">
                            <tbody>
                            {product.productSpecs.map((spec, index) => (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                                >
                                    <th
                                        scope="row"
                                        className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap border-b border-gray-200 w-1/3"
                                    >
                                        {spec.specName}
                                    </th>
                                    <td className="py-3 px-4 border-b border-gray-200">
                                        {spec.specValue}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="mt-10 bg-white rounded-md p-4 shadow">
                <ProductDescription description={product.description}/>
            </div>

            <div className="mt-10 bg-white rounded-md p-4 shadow">
                <h2 className="text-xl font-semibold mb-4">Đánh giá sản phẩm</h2>
                {product.productReviews.length === 0 && (
                    <p className="text-sm text-gray-500">Chưa có đánh giá nào.</p>
                )}

                {product.productReviews.map((reviewer) => (
                    <div key={reviewer.customerId} className="mb-6">
                        <h4 className="text-base font-semibold mb-2">{reviewer.customerName}</h4>

                        {reviewer.reviews.map((r) => (
                            <div
                                key={r.reviewId}
                                className="border border-gray-200 bg-white shadow-sm rounded-lg p-4"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center text-yellow-500">
                                        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                                    </div>
                                    <span className="text-sm font-medium text-yellow-600">
                                        {r.rating}/5
                                    </span>
                                    {r.isVerified && (
                                        <span className="ml-2 px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
                                            Đã mua hàng
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-700">{r.comment}</p>
                                <p className="text-xs text-gray-400 mt-2">
                                    {new Date(r.created_at).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                        ))}
                    </div>
                ))}

                <div className="mt-6 ">
                    <ReviewForm productId={product.productId}/>
                </div>
            </div>
        </div>
    );
}
