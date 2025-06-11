'use client';

import {useEffect, useState, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import axiosClient from '@/lib/axiosClient';
import {RootState} from '@/store';
import {setCart, resetCart} from '@/store/cartSlice';
import {CustomerInfo} from '@/types/customerInfo';
import {useRouter} from 'next/navigation';
import Swal from 'sweetalert2';

export default function CheckoutPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const customerId = useSelector((state: RootState) => state.auth.customer?.customerId ?? null);
    const cart = useSelector((state: RootState) => state.cart.cart);

    const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
    const [selectedAddressIdx, setSelectedAddressIdx] = useState<number>(-1);
    const [address, setAddress] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [note, setNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank'>('cod');

    const fetchCart = useCallback(async () => {
        if (!customerId) {
            dispatch(resetCart());
            return;
        }

        try {
            const res = await axiosClient.get(`/api/v1/cart/${customerId}`);
            dispatch(setCart(res.data));
        } catch {
            dispatch(resetCart());
        }
    }, [customerId, dispatch]);

    const fetchCustomerInfo = async () => {
        try {
            const res = await axiosClient.get(`/api/v1/customers/${customerId}`);
            setCustomerInfo(res.data);
        } catch (error) {
            console.error('Lỗi tải thông tin khách hàng:', error);
        }
    };

    useEffect(() => {
        fetchCart();
        if (customerId) {
            fetchCustomerInfo();
        }
    }, [customerId]);

    useEffect(() => {
        if (selectedAddressIdx >= 0 && customerInfo?.address?.[selectedAddressIdx]) {
            const a = customerInfo.address[selectedAddressIdx];
            setAddress(`${a.street}, ${a.hamlet}, ${a.ward}, ${a.district}, ${a.city}`);
        } else {
            setAddress('');
        }
    }, [selectedAddressIdx]);

    const handleSubmit = async () => {
        if (!name || !phone || !address) {
            alert('Vui lòng nhập đầy đủ thông tin giao hàng.');
            return;
        }

        try {
            const payload = {
                cartId: cart!.cartId,
                receiverName: name,
                receiverPhone: phone,
                receiverAddress: address,
                note: note,
                sessionId: sessionStorage.getItem('session_id') || '',
                paymentMethod: paymentMethod === 'cod' ? 1 : 2,
            };

            const response = await axiosClient.post('/api/v1/order/create', payload);
            console.log('✅ Đặt hàng thành công:', response.data);

            await Swal.fire('🎉 Đặt hàng thành công!', 'Cảm ơn bạn đã mua hàng!', 'success');
            router.push('/');
        } catch (error) {
            console.error('❌ Lỗi khi đặt hàng:', error);
            alert('❌ Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
        }
    };

    if (!cart) return <p>Đang tải đơn hàng...</p>;

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white rounded p-6 shadow max-w-3xl mx-auto">
                <h1 className="text-xl font-bold mb-6">Thông tin giao hàng</h1>

                {customerInfo && (
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Địa chỉ đã lưu trữ</label>
                        <select
                            value={selectedAddressIdx}
                            onChange={(e) => {
                                const idx = parseInt(e.target.value);
                                setSelectedAddressIdx(idx);

                                if (idx >= 0 && customerInfo?.address[idx]) {
                                    const selected = customerInfo.address[idx];
                                    setName(customerInfo.customerName || '');
                                    setPhone(customerInfo.phone || '');
                                    setAddress(`${selected.street}, ${selected.hamlet}, ${selected.ward}, ${selected.district}, ${selected.city}`);
                                } else {
                                    setName('');
                                    setPhone('');
                                    setAddress('');
                                }
                            }}
                            className="w-full border p-2 rounded"
                        >
                            <option value={-1}>Thêm địa chỉ mới...</option>
                            {customerInfo?.address.map((a, idx) => (
                                <option key={idx} value={idx}>
                                    {`${a.street}, ${a.hamlet}, ${a.ward}, ${a.district}, ${a.city}`}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

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

                <h2 className="text-lg font-semibold mb-2">Phương thức thanh toán</h2>
                <div className="flex flex-col mb-6 gap-2">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="payment"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                        />
                        Thanh toán khi giao hàng (COD)
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="payment"
                            value="bank"
                            checked={paymentMethod === 'bank'}
                            onChange={() => setPaymentMethod('bank')}
                        />
                        Chuyển khoản qua ngân hàng
                    </label>
                    {paymentMethod === 'bank' && (
                        <div className="bg-gray-50 p-4 border rounded text-sm text-gray-700 space-y-2">
                            <p><strong>STK đặt hàng Kinh doanh Online</strong></p>
                            <p>Tên: <strong>LAM VINH PHAT</strong></p>
                            <div className="flex items-center gap-2">
                <span>
                  Số tài khoản: <strong id="account-number">0071001013710</strong> | VCB
                </span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText('0071001013710');
                                    }}
                                    className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
                                >
                                    Sao chép
                                </button>
                            </div>
                            <p className="text-red-600">
                                Lưu ý: Vui lòng liên hệ nhân viên hỗ trợ kiểm tra tồn kho sản phẩm trước khi thanh toán!
                            </p>
                        </div>
                    )}
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
