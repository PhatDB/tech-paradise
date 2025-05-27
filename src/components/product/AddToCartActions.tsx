'use client';

import {useState, useEffect} from 'react';
import QuantitySelector from './QuantitySelector';
import axiosClient from '@/lib/axiosClient';
import Swal from 'sweetalert2';
import {useRouter} from 'next/navigation';

interface Props {
    productId: number;
}

export default function AddToCartActions({productId}: Props) {
    const [quantity, setQuantity] = useState(1);
    const [customerId, setCustomerId] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedId = localStorage.getItem('customerId');
        if (storedId) {
            setCustomerId(parseInt(storedId));
        }
    }, []);

    const handleAddToCart = async (redirect = false) => {
        if (!customerId) {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn chưa đăng nhập',
                text: 'Vui lòng đăng nhập để tiếp tục.',
                confirmButtonText: 'Đăng nhập',
            }).then(() => {
                router.push('/login');
            });
            return;
        }

        try {
            const res = await axiosClient.post('/api/v1/cart/add-to-cart', {
                customerId,
                productId,
                quantity,
            });

            if (res.status === 200 || res.status === 204) {
                if (redirect) {
                    router.push('/checkout');
                } else {
                    Swal.fire('Cảm ơn bạn!', 'Sản phẩm đã được thêm vào giỏ hàng.', 'success');
                }
            }
        } catch (e) {
            Swal.fire('Thất bại', 'Không thể thêm vào giỏ hàng.', 'error');
        }
    };

    return (
        <div className="flex items-center gap-4 mt-4">
            <QuantitySelector value={quantity} onChange={setQuantity}/>
            <button
                onClick={() => handleAddToCart(false)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
                Thêm vào giỏ
            </button>
            <button
                onClick={() => handleAddToCart(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Mua ngay
            </button>
        </div>
    );
}