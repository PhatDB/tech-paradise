'use client';

import {useEffect, useState} from 'react';
import axiosClient from '@/lib/axiosClient';
import {Cart} from '@/types/cart';
import CartItemRow from '@/components/cart/CartItemRow';
import CartSummary from '@/components/cart/CartSummary';

export default function CartPage() {
    const [cart, setCart] = useState<Cart | null>(null);
    const [customerId, setCustomerId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedId = localStorage.getItem('customerId');
        if (storedId) {
            setCustomerId(parseInt(storedId));
        }
        setLoading(false);
    }, []);

    const fetchCart = async () => {
        if (!customerId) return;

        try {
            const res = await axiosClient.get(`/api/v1/cart/${customerId}`);
            setCart(res.data);
        } catch (err) {
            console.error('Lỗi khi tải giỏ hàng:', err);
        }
    };

    const handleRemove = (productId: number) => {
        setCart((prev) => {
            if (!prev) return prev;
            const updatedItems = prev.cartItems.filter((item) => item.productId !== productId);
            const newTotal = updatedItems.reduce(
                (sum, item) => sum + item.discountPrice * item.quantity,
                0
            );
            return {...prev, cartItems: updatedItems, totalPrice: newTotal};
        });
    };

    useEffect(() => {
        if (customerId) fetchCart();
    }, [customerId]);

    if (loading) return <p>Đang tải...</p>;

    if (!customerId) {
        return (
            <div className="container mx-auto p-6 text-center text-red-600 font-semibold text-lg">
                Bạn chưa đăng nhập. Vui lòng đăng nhập để xem giỏ hàng.
            </div>
        );
    }

    if (!cart) return <p className="text-center">Đang tải giỏ hàng...</p>;

    return (
        <div className="container mx-auto p-3">
            <div className="bg-white rounded-md p-4 shadow">
                <h1 className="text-xl font-bold mb-4">Giỏ hàng của bạn</h1>

                {cart.cartItems.length === 0 ? (
                    <div className="text-center py-10 text-gray-600">
                        <p>Không có sản phẩm nào trong giỏ hàng</p>
                    </div>
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
                                        item={item}
                                        onRemove={handleRemove}
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
