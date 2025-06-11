'use client';

import {useState, useEffect} from 'react';
import QuantitySelector from './QuantitySelector';
import axiosClient from '@/lib/axiosClient';
import Swal from 'sweetalert2';
import {useRouter} from 'next/navigation';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {v4 as uuidv4} from 'uuid';
import {ErrorResponse} from '@/types/errorResponse';

interface Props {
    productId: number;
}

const isErrorResponse = (error: unknown): error is ErrorResponse => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'type' in error &&
        'title' in error &&
        'status' in error &&
        'detail' in error
    );
};

export default function AddToCartActions({productId}: Props) {
    const [quantity, setQuantity] = useState(1);
    const customerId = useSelector((state: RootState) => state.auth.customer?.customerId ?? null);
    const router = useRouter();
    const [sessionId, setSessionId] = useState<string | null>(null);

    useEffect(() => {
        if (!customerId) {
            let storedSessionId = localStorage.getItem('sessionId');
            if (!storedSessionId) {
                storedSessionId = uuidv4();
                localStorage.setItem('sessionId', storedSessionId);
            }
            setSessionId(storedSessionId);
        }
    }, [customerId]);

    const handleAddToCart = async (redirect = false) => {
        const payload = customerId
            ? {
                customerId,
                sessionId: null,
                productId,
                quantity,
            }
            : sessionId
                ? {
                    customerId: null,
                    sessionId,
                    productId,
                    quantity,
                }
                : null;

        if (!payload) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi hệ thống',
                text: 'Không thể xác định khách hàng hoặc phiên làm việc, vui lòng thử lại.',
            });
            return;
        }

        try {
            const res = await axiosClient.post('/api/v1/cart/add-to-cart', payload);

            if (res.status === 200 || res.status === 204) {
                if (redirect) {
                    router.push('/checkout');
                } else {
                    Swal.fire('Cảm ơn bạn!', 'Sản phẩm đã được thêm vào giỏ hàng.', 'success');
                }
            }
        } catch (error: unknown) {
            if (isErrorResponse(error)) {
                if (error.status === 400 && error.title === 'Customer.CustomerAlreadyExists') {
                    Swal.fire('Lỗi', error.detail, 'error');
                } else {
                    Swal.fire('Thất bại', error.detail || 'Không thể thêm vào giỏ hàng.', 'error');
                }
            } else {
                Swal.fire('Thất bại', 'Có lỗi xảy ra, vui lòng thử lại.', 'error');
            }
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
