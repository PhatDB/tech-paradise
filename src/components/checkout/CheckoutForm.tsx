import {useState, useEffect} from 'react';
import {Cart} from '@/types/cart';
import axiosClient from '@/lib/axiosClient';

export default function CheckoutPage() {
    const [cart, setCart] = useState<Cart | null>(null);
    const [address, setAddress] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        const id = localStorage.getItem('customerId');
        if (id) {
            axiosClient.get(`/api/v1/cart/${id}`).then(res => setCart(res.data));
        }
    }, []);

    const handleSubmit = () => {
        if (!name || !phone || !address) {
            alert('Vui lòng nhập đầy đủ thông tin giao hàng.');
            return;
        }

        alert('✅ Đơn hàng đã được tạo thành công!');
    };

    if (!cart) return <p>Đang tải đơn hàng...</p>;

    return (
        <div className="container mx-auto">
            <div className="bg-white rounded p-4 shadow">
                <h1 className="text-xl font-bold mb-4">Thông tin giao hàng</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Họ và tên"
                        className="border p-2 rounded"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Số điện thoại"
                        className="border p-2 rounded"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Địa chỉ giao hàng"
                        className="border p-2 rounded col-span-full"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <textarea
                        placeholder="Ghi chú (không bắt buộc)"
                        className="border p-2 rounded col-span-full"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>

                <h2 className="text-lg font-semibold mb-2">Sản phẩm trong giỏ hàng</h2>
                <div className="border rounded p-3 bg-white mb-4">
                    {cart.cartItems.map((item) => (
                        <div key={item.productId} className="flex justify-between py-2 border-b last:border-none">
                            <span>{item.productName} (x{item.quantity})</span>
                            <span>{item.discountPrice.toLocaleString()} đ</span>
                        </div>
                    ))}
                    <div className="flex justify-between mt-4 font-semibold">
                        <span>Tổng cộng:</span>
                        <span className="text-red-600">{cart.totalPrice.toLocaleString()} đ</span>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Hoàn tất đơn hàng
                </button>
            </div>
        </div>
    );
}
