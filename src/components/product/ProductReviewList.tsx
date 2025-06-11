'use client'

import {useEffect, useState} from 'react'
import ReviewForm from './ReviewForm'
import {ProductReview} from '@/types/product'
import axiosClient from '@/lib/axiosClient'
import {Button} from '@/components/ui/Button'

interface Props {
    productId: number
}

export default function ProductReviewList({productId}: Props) {
    const [reviews, setReviews] = useState<ProductReview[]>([])
    const [showAll, setShowAll] = useState(false)

    const fetchReviews = async () => {
        try {
            const res = await axiosClient.get(`/api/v1/products/${productId}`)
            setReviews(res.data.productReviews || [])
        } catch (e) {
            console.error('Lỗi tải đánh giá:', e)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [productId])

    const flatReviews = reviews.flatMap(customer =>
        customer.reviews.map(review => ({
            ...review,
            customerName: customer.customerName,
            customerId: customer.customerId,
        }))
    ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    const visibleReviews = showAll ? flatReviews : flatReviews.slice(0, 2)

    return (
        <div className="mt-10 bg-white rounded p-4 shadow">
            <h2 className="text-lg font-semibold mb-4">Đánh giá sản phẩm</h2>

            {flatReviews.length === 0 ? (
                <p className="text-sm text-gray-500">Chưa có đánh giá nào.</p>
            ) : (
                <div className="space-y-6">
                    {visibleReviews.map((r, index) => (
                        <div
                            key={`${r.customerId}-${r.reviewId}-${index}`}
                            className="border border-gray-200 bg-white shadow-sm rounded-lg p-4"
                        >
                            <p className="font-medium">{r.customerName}</p>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="text-yellow-500">
                                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                                </div>
                                <span className="text-sm font-medium text-yellow-600">{r.rating}/5</span>
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

                    {flatReviews.length > 2 && (
                        <div className="text-center mt-4">
                            <Button variant="outline" onClick={() => setShowAll(prev => !prev)}>
                                {showAll ? 'Ẩn bớt' : 'Xem thêm'}
                            </Button>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-6">
                <ReviewForm productId={productId} onSubmitSuccess={fetchReviews}/>
            </div>
        </div>
    )
}
