import {useEffect, useState} from 'react';
import axiosClient from '@/lib/axiosClient';

function getSessionId() {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = crypto.randomUUID(); // tạo mới UUID cho session
        localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}

export default function useCart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCart() {
            const customer = localStorage.getItem('customer');
            const customerId = customer ? JSON.parse(customer).customerId : null;

            let url = '';
            if (customerId) {
                url = `/api/v1/cart/${customerId}`;
            } else {
                const sessionId = getSessionId();
                url = `/api/v1/cart/session/${sessionId}`;
            }

            setLoading(true);
            try {
                const res = await axiosClient.get(url);
                setCart(res.data);
            } catch (error) {
                setCart(null);
                console.error('Lỗi khi lấy giỏ hàng:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchCart();
    }, []);

    return {cart, loading};
}
