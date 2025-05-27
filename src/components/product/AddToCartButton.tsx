'use client';

import {useState} from 'react';
import axiosClient from '@/lib/axiosClient';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
    productId: number;
    quantity: number;
}

export default function AddToCartButton({productId, quantity}: Props) {
    const [loading, setLoading] = useState(false);

    const handleAddToCart = async () => {
        const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

        if (!userId) {
            toast.warning('Bạn chưa đăng nhập!', {position: 'top-center'});
            return;
        }

        try {
            setLoading(true);
            await axiosClient.post('/api/v1/cart/add-to-cart', {
                customerId: Number(userId),
                productId,
                quantity
            });
            toast.success('Đã thêm sản phẩm vào giỏ hàng!', {position: 'top-center'});
        } catch (error) {
            toast.error('Lỗi khi thêm vào giỏ hàng!', {position: 'top-center'});
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={loading}
            className="border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-50 disabled:opacity-50"
        >
            {loading ? 'Đang thêm...' : 'Thêm vào giỏ'}
        </button>
    );
}
