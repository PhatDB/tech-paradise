'use client';

import {useEffect, useCallback, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import axiosClient from '@/lib/axiosClient';
import {RootState} from '@/store';
import {setCart} from '@/store/cartSlice';
import CartItemRow from '@/components/cart/CartItemRow';
import CartSummary from '@/components/cart/CartSummary';
import {AxiosError} from 'axios';

function generateSessionId(): string {
    const id = crypto.randomUUID();
    localStorage.setItem('sessionId', id);
    return id;
}

export default function CartPage() {
    const dispatch = useDispatch();
    const customerId = useSelector((state: RootState) => state.auth.customer?.customerId ?? null);
    const cart = useSelector((state: RootState) => state.cart.cart);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!customerId) {
            const storedSessionId = localStorage.getItem('sessionId');
            if (storedSessionId) {
                setSessionId(storedSessionId);
            } else {
                setSessionId(generateSessionId());
            }
        }
    }, [customerId]);

    const fetchCart = useCallback(async () => {
        setLoading(true);
        try {
            if (customerId) {
                const res = await axiosClient.get(`/api/v1/cart/${customerId}`);
                dispatch(setCart(res.data));
            } else if (sessionId) {
                const res = await axiosClient.get(`/api/v1/cart/session/${sessionId}`);
                dispatch(setCart(res.data));
            } else {
                dispatch(setCart(null));
            }
        } catch (err) {
            if (err instanceof AxiosError && err.response?.status === 404) {
                dispatch(setCart(null));
            } else {
                console.error('Lỗi khi tải giỏ hàng:', err);
                dispatch(setCart(null));
            }
        } finally {
            setLoading(false);
        }
    }, [customerId, sessionId, dispatch]);

    useEffect(() => {
        fetchCart();
    }, [customerId, fetchCart]);

    if (loading) return <p className="text-center py-10">Đang tải giỏ hàng...</p>;

    if (!customerId && !sessionId)
        return (
            <div className="container mx-auto p-6 text-center text-gray-700 font-semibold text-lg">
                Giỏ hàng của bạn đang trống.
            </div>
        );

    if (!cart) return <p className="text-center py-10">Giỏ hàng của bạn đang trống.</p>;

    return (
        <div className="container mx-auto p-3">
            <div className="bg-white rounded-md p-4 shadow">
                <h1 className="text-xl font-bold mb-4">Giỏ hàng của bạn</h1>

                {cart.cartItems.length === 0 ? (
                    <div className="text-center py-10 text-gray-600">Không có sản phẩm nào trong giỏ hàng</div>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded border border-gray-200 bg-white">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="p-3">Hình ảnh</th>
                                    <th className="p-3">Tên sản phẩm</th>
                                    <th className="p-3 text-right">Giá</th>
                                    <th className="p-3 text-center">Số lượng</th>
                                    <th className="p-3 text-right">Tổng</th>
                                    <th className="p-3 text-center">Xóa</th>
                                </tr>
                                </thead>
                                <tbody>
                                {cart.cartItems.map((item) => (
                                    <CartItemRow
                                        key={item.productId}
                                        cartId={cart.cartId}
                                        item={item}
                                        customerId={customerId}
                                        sessionId={!customerId ? sessionId ?? undefined : undefined}
                                        onQuantityUpdated={fetchCart}
                                    />
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <CartSummary total={cart.totalPrice}/>
                    </>
                )}
            </div>
        </div>
    );
}
