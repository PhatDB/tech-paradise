'use client';

import {useEffect, useState, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import axiosClient from '@/lib/axiosClient';
import {RootState} from '@/store';
import {setCart, resetCart} from '@/store/cartSlice';

export default function CheckoutPage() {
    const dispatch = useDispatch();
    const customerId = useSelector((state: RootState) => state.auth.customer?.customerId ?? null);
    const cart = useSelector((state: RootState) => state.cart.cart);

    const fetchCart = useCallback(async () => {
        if (!customerId) {
            dispatch(resetCart());
            return;
        }

        try {
            const res = await axiosClient.get(`/api/v1/cart/${customerId}`);
            dispatch(setCart(res.data));
        } catch (err) {
            console.error('Lỗi khi tải giỏ hàng:', err);
            dispatch(resetCart());
        }
    }, [customerId, dispatch]);

    useEffect(() => {
        fetchCart();
    }, [customerId, fetchCart]);

    const [address, setAddress] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [note, setNote] = useState('');

    const handleSubmit = () => {
        if (!name || !phone || !address) {
            alert('Vui lòng nhập đầy đủ thông tin giao hàng.');
            return;
        }

        // TODO: Gửi dữ liệu tạo đơn hàng lên backend với cart và thông tin giao hàng

        alert('✅ Đơn hàng đã được tạo thành công!');
    };

    if (!cart) return <p>Đang tải đơn hàng...</p>;

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white rounded p-6 shadow max-w-3xl mx-auto">
                <h1 className="text-xl font-bold mb-6">Thông tin giao hàng</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Họ và tên"
                        className="border p-3 rounded"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Số điện thoại"
                        className="border p-3 rounded"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Địa chỉ giao hàng"
                        className="border p-3 rounded col-span-full"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <textarea
                        placeholder="Ghi chú (không bắt buộc)"
                        className="border p-3 rounded col-span-full"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>

                <h2 className="text-lg font-semibold mb-3">Sản phẩm trong giỏ hàng</h2>
                <div className="border rounded p-4 bg-white mb-6 max-h-60 overflow-y-auto">
                    {cart.cartItems.map((item) => (
                        <div
                            key={item.productId}
                            className="flex justify-between py-2 border-b last:border-none"
                        >
                            <span>{item.productName} (x{item.quantity})</span>
                            <span>{item.discountPrice.toLocaleString()} đ</span>
                        </div>
                    ))}
                    <div className="flex justify-between mt-4 font-semibold text-lg">
                        <span>Tổng cộng:</span>
                        <span className="text-red-600">{cart.totalPrice.toLocaleString()} đ</span>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full py-3 text-white rounded bg-blue-600 hover:bg-blue-700"
                >
                    Hoàn tất đơn hàng
                </button>
            </div>
        </div>
    );
}
