'use client';

import {useEffect, useState} from 'react';
import axiosClient from '@/lib/axiosClient';

interface Review {
    customerId: number;
    productId: number;
    productName: string;
    imageUrl: string;
    customerName: string;
    email: { value: string };
    comment: string;
    rating: number;
    isVerified: boolean;
}

export default function AdminReviewPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axiosClient.get('/api/v1/customers/reviews');
                setReviews(res.data);
            } catch (err) {
                console.error('Lỗi khi tải đánh giá:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) return <div className="p-6">⏳ Đang tải danh sách đánh giá...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">💬 Quản lý đánh giá</h1>
            <table className="min-w-full table-auto border border-gray-300 bg-white shadow-md rounded">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-3 text-left border-b">Sản phẩm</th>
                    <th className="p-3 text-left border-b">Khách hàng</th>
                    <th className="p-3 text-left border-b">Email</th>
                    <th className="p-3 text-left border-b">Đánh giá</th>
                    <th className="p-3 text-left border-b">Sao</th>
                    <th className="p-3 text-left border-b">Xác thực</th>
                </tr>
                </thead>
                <tbody>
                {reviews.map((r, index) => (
                    <tr key={index} className="hover:bg-gray-50 align-top">
                        <td className="p-3 border-b">
                            <div className="flex items-center gap-2">
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${r.imageUrl}`}
                                    alt={r.productName}
                                    className="w-12 h-12 object-cover rounded"
                                />
                                <span className="text-sm font-medium">{r.productName}</span>
                            </div>
                        </td>
                        <td className="p-3 border-b text-sm">{r.customerName}</td>
                        <td className="p-3 border-b text-sm text-blue-600 italic">{r.email.value}</td>
                        <td className="p-3 border-b text-sm">{r.comment}</td>
                        <td className="p-3 border-b text-sm text-yellow-600">{r.rating} ⭐</td>
                        <td className="p-3 border-b text-sm">
                            {r.isVerified ? <span className="text-green-600">✅</span> :
                                <span className="text-gray-400">—</span>}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
