'use client';

import {useEffect, useState, useMemo} from 'react';
import axiosClient from '@/lib/axiosClient';
import {format} from 'date-fns';
import Swal from 'sweetalert2';
import {handleErrorResponse} from '@/lib/errorHandler';

interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}

interface Order {
    orderId: number;
    totalAmount: number;
    status: number;
    createdAt: string;
    orderItems: OrderItem[];
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
}

const statusMap: Record<number, { label: string; color: string; apiEndpoint: string }> = {
    0: {
        label: '⏳ Đang chờ xác nhận',
        color: 'bg-gray-200 text-gray-800',
        apiEndpoint: '/api/v1/order/confirmed',
    },
    1: {
        label: '✅ Đã xác nhận',
        color: 'bg-blue-200 text-blue-800',
        apiEndpoint: '/api/v1/order/paid-or-shipping',
    },
    2: {
        label: '💳 Đã thanh toán',
        color: 'bg-indigo-200 text-indigo-800',
        apiEndpoint: '/api/v1/order/paid',
    },
    3: {
        label: '🚚 Đang giao hàng',
        color: 'bg-yellow-200 text-yellow-800',
        apiEndpoint: '/api/v1/order/shipping',
    },
    4: {
        label: '📦 Đã giao thành công',
        color: 'bg-green-200 text-green-800',
        apiEndpoint: '/api/v1/order/delivered',
    },
    5: {
        label: '❌ Đã huỷ',
        color: 'bg-red-200 text-red-800',
        apiEndpoint: '/api/v1/order/cancel',
    },
};


export default function AdminOrderPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchName, setSearchName] = useState('');
    const [searchPhone, setSearchPhone] = useState('');
    const [sortAsc, setSortAsc] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axiosClient.get('/api/v1/orders');
                setOrders(res.data);
            } catch (err) {
                console.error('Error loading orders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filteredOrders = useMemo(() => {
        const result = orders.filter((o) =>
            o.receiverName.toLowerCase().includes(searchName.toLowerCase()) &&
            o.receiverPhone.includes(searchPhone)
        );
        result.sort((a, b) => sortAsc ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt));
        return result;
    }, [orders, searchName, searchPhone, sortAsc]);

    const handleUpdateStatus = async (orderId: number) => {
        const {value: selectedStatus} = await Swal.fire({
            title: 'Cập nhật trạng thái đơn hàng',
            input: 'select',
            inputOptions: Object.entries(statusMap).reduce((acc, [key, val]) => {
                acc[key] = val.label;
                return acc;
            }, {} as Record<string, string>),
            inputPlaceholder: 'Chọn trạng thái mới',
            showCancelButton: true,
            confirmButtonText: 'Cập nhật',
            cancelButtonText: 'Huỷ',
        });

        if (selectedStatus !== undefined) {
            const endpoint = statusMap[Number(selectedStatus)].apiEndpoint;
            try {
                await axiosClient.post(endpoint, {orderId});
                setOrders((prev) =>
                    prev.map((order) =>
                        order.orderId === orderId ? {...order, status: Number(selectedStatus)} : order
                    )
                );
                Swal.fire('Thành công', 'Đã cập nhật trạng thái đơn hàng!', 'success');
            } catch (err) {
                handleErrorResponse(err)
                Swal.fire('Lỗi', 'Không thể cập nhật trạng thái', 'error');
            }
        }
    };

    if (loading) return <div className="p-6">⏳ Đang tải danh sách đơn hàng...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">🛒 Quản lý đơn hàng</h1>

            <div className="flex flex-wrap gap-4 mb-4">
                <input
                    type="text"
                    placeholder="🔍 Tìm theo tên khách hàng"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="border p-2 rounded w-64"
                />
                <input
                    type="text"
                    placeholder="📞 Tìm theo số điện thoại"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                    className="border p-2 rounded w-64"
                />
                <button
                    onClick={() => setSortAsc(!sortAsc)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    {sortAsc ? '⬆️ Ngày tăng dần' : '⬇️ Ngày giảm dần'}
                </button>
            </div>

            <table className="min-w-full table-auto border border-gray-300 bg-white shadow-md rounded">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-3 text-left border-b">Mã đơn</th>
                    <th className="p-3 text-left border-b">Tên khách hàng</th>
                    <th className="p-3 text-left border-b">SĐT</th>
                    <th className="p-3 text-left border-b">Địa chỉ</th>
                    <th className="p-3 text-left border-b">Sản phẩm</th>
                    <th className="p-3 text-left border-b">Tổng tiền</th>
                    <th className="p-3 text-left border-b">Trạng thái</th>
                    <th className="p-3 text-left border-b">Ngày tạo</th>
                    <th className="p-3 text-left border-b">Thao tác</th>
                </tr>
                </thead>
                <tbody>
                {filteredOrders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-50 align-top">
                        <td className="p-3 border-b">#{order.orderId}</td>
                        <td className="p-3 border-b text-sm">{order.receiverName}</td>
                        <td className="p-3 border-b text-sm">{order.receiverPhone}</td>
                        <td className="p-3 border-b text-sm text-gray-600 italic">{order.receiverAddress}</td>
                        <td className="p-3 border-b">
                            <ul className="list-disc pl-4 text-sm space-y-1">
                                {order.orderItems.map((item) => (
                                    <li key={item.productId}>
                                        {item.productName} × {item.quantity}
                                    </li>
                                ))}
                            </ul>
                        </td>
                        <td className="p-3 border-b">{order.totalAmount.toLocaleString()} ₫</td>
                        <td className="p-3 border-b">
                <span className={`px-2 py-1 text-sm rounded ${statusMap[order.status]?.color || 'bg-gray-200'}`}>
                  {statusMap[order.status]?.label || 'Không rõ'}
                </span>
                        </td>
                        <td className="p-3 border-b">{format(new Date(order.createdAt), 'dd/MM/yyyy')}</td>
                        <td className="p-3 border-b">
                            <button
                                onClick={() => handleUpdateStatus(order.orderId)}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                                ✏️ Cập nhật trạng thái
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
