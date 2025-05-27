'use client';

import ReviewForm from './ReviewForm';
import {ProductReview} from "@/types/product";

interface Props {
    reviews: ProductReview[];
    productId: number;
}

export default function ProductReviewList({reviews, productId}: Props) {
    return (
        <div className="mt-10 bg-white rounded p-4 shadow">
            <h2 className="text-lg font-semibold mb-4">Đánh giá sản phẩm</h2>

            {reviews.length === 0 ? (
                <p className="text-sm text-gray-500">Chưa có đánh giá nào.</p>
            ) : (
                <div className="space-y-6">
                    {reviews.map((customer) => (
                        <div key={customer.customerId}>
                            <p className="font-medium">{customer.customerName}</p>
                            {customer.reviews.map((r) => (
                                <div
                                    key={r.reviewId}
                                    className="mt-2 border border-gray-200 bg-white shadow-sm rounded-lg p-4"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="text-yellow-500">
                                            {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                                        </div>
                                        <span className="text-sm font-medium text-yellow-600">{r.rating}/5</span>
                                        {r.isVerified && (
                                            <span
                                                className="ml-2 px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
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
                </div>
            )}

            <div className="mt-6">
                <ReviewForm productId={productId}/>
            </div>
        </div>
    );
}
