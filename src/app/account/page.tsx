// components/pages/account/AccountPage.tsx

'use client';

import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@/store';
import {logout} from '@/store/authSlice';
import {User, MapPin, Package, LogOut, Plus, Trash2} from 'lucide-react';
import axiosClient from '@/lib/axiosClient';
import {CustomerInfo} from '@/types/customerInfo';
import {Order} from '@/types/order';
import {handleErrorResponse} from '@/lib/errorHandler';
import Swal from 'sweetalert2';
import clsx from 'clsx';
import {getOrderStatusText} from "@/lib/getOrderStatusText";

export default function AccountPage() {
    const dispatch = useDispatch<AppDispatch>();
    const customerId = useSelector((state: RootState) => state.auth.customer?.customerId ?? null);

    const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [activeTab, setActiveTab] = useState<'info' | 'address' | 'orders' | 'recent'>('info');
    const [formData, setFormData] = useState({customerName: '', phone: ''});
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        customerId: customerId,
        city: '',
        district: '',
        ward: '',
        hamlet: '',
        street: '',
    });

    const fetchCustomerInfo = async () => {
        try {
            const response = await axiosClient.get<CustomerInfo>(`/api/v1/customers/${customerId}`);
            setCustomerInfo(response.data);
            setFormData({
                customerName: response.data.customerName || '',
                phone: response.data.phone || '',
            });
        } catch (error: unknown) {
            Swal.fire('Lỗi', handleErrorResponse(error), 'error');
        }
    };

    const fetchOrders = async (customerId: number) => {
        try {
            const response = await axiosClient.get<Order[]>(`/api/v1/orders/customer/${customerId}`);
            console.log(response);
            setOrders(response.data);
        } catch (error: unknown) {
            handleErrorResponse(error)
        }
    };

    const handleUpdateInfo = async () => {
        try {
            await axiosClient.put(`/api/v1/customers/${customerId}`, {
                ...customerInfo,
                customerName: formData.customerName,
                phone: formData.phone,
            });
            await fetchCustomerInfo();
            Swal.fire('Thành công!', 'Thông tin đã được cập nhật.', 'success');
        } catch (error: unknown) {
            Swal.fire('Lỗi', handleErrorResponse(error), 'error');
        }
    };

    const handleAddAddress = async () => {
        const {city, district, ward, hamlet, street} = newAddress;

        const isValid = [city, district, ward, hamlet, street].every(val =>
            typeof val === 'string' && val.trim().length >= 2
        );

        if (!isValid) {
            Swal.fire('Lỗi', 'Vui lòng nhập thông tin địa chỉ hợp lệ (tối thiểu 2 ký tự).', 'warning');
            return;
        }

        try {
            await axiosClient.post(`/api/v1/customer/address`, {
                ...newAddress,
                customerId
            });
            Swal.fire('Thành công', 'Đã thêm địa chỉ mới', 'success');
            fetchCustomerInfo();
            setShowAddressForm(false);
            setNewAddress({
                customerId: customerId!,
                city: '',
                district: '',
                ward: '',
                hamlet: '',
                street: '',
            });
        } catch (error) {
            Swal.fire('Lỗi', handleErrorResponse(error), 'error');
        }
    };


    const handleDeleteAddress = async (addressId: number) => {
        try {
            await axiosClient.delete(`/api/v1/customer/address/${addressId}`);
            Swal.fire('Thành công', 'Đã xoá địa chỉ', 'success');
            fetchCustomerInfo();
        } catch (error) {
            Swal.fire('Lỗi', handleErrorResponse(error), 'error');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('customer');
        dispatch(logout());
        window.location.href = '/';
    };

    useEffect(() => {
        if (customerId) {
            fetchCustomerInfo();
        }
    }, [customerId]);

    useEffect(() => {
        if (customerInfo) {
            fetchOrders(customerInfo.customerId);
        }
    }, [customerInfo]);

    if (!customerInfo) {
        return <div className="text-center py-10">Đang tải thông tin khách hàng...</div>;
    }

    return (
        <div className="flex flex-col md:flex-row container mx-auto p-4">
            <aside className="w-full md:w-64 bg-white border rounded-lg shadow-md mb-6 md:mb-0 md:mr-6">
                <div className="p-4 border-b font-semibold text-lg">{customerInfo.customerName}</div>
                <nav className="flex flex-col divide-y">
                    {['info', 'address', 'orders'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as typeof activeTab)}
                            className={clsx('flex items-center px-4 py-3 gap-2 text-left hover:bg-gray-100', {
                                'text-red-600 font-semibold': activeTab === tab,
                            })}
                        >
                            {tab === 'info' && <User size={18}/>}
                            {tab === 'address' && <MapPin size={18}/>}
                            {tab === 'orders' && <Package size={18}/>}
                            {tab === 'info' && 'Thông tin tài khoản'}
                            {tab === 'address' && 'Số địa chỉ'}
                            {tab === 'orders' && 'Quản lý đơn hàng'}
                        </button>
                    ))}
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-3 gap-2 text-left hover:bg-gray-100"
                    >
                        <LogOut size={18}/> Đăng xuất
                    </button>
                </nav>
            </aside>

            <section className="flex-1 bg-white rounded-lg shadow-md p-6">
                {activeTab === 'info' && (
                    <>
                        <h2 className="text-xl font-semibold mb-4">Thông tin tài khoản</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdateInfo();
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block font-semibold mb-1">Họ Tên</label>
                                <input
                                    type="text"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">Số điện thoại</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full border px-3 py-2 rounded"
                                    placeholder="VD: 0912345678"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">Email</label>
                                <input
                                    type="email"
                                    value={customerInfo.email}
                                    disabled
                                    className="w-full bg-gray-100 px-3 py-2 rounded"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Lưu thay đổi
                            </button>
                        </form>
                    </>
                )}

                {activeTab === 'address' && (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Số địa chỉ</h2>
                            <button
                                onClick={() => setShowAddressForm(!showAddressForm)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                <Plus size={16} className="inline mr-1"/>
                                Thêm địa chỉ mới
                            </button>
                        </div>
                        {customerInfo.address.length > 0 ? (
                            <div className="space-y-4">
                                {customerInfo.address.map((addr, idx) => (
                                    <div key={idx} className="border p-3 rounded relative">
                                        <button
                                            onClick={() => handleDeleteAddress(addr.addressId)}
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                            title="Xoá địa chỉ"
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                        <div>
                                            {addr.street}, {addr.hamlet}, {addr.ward}, {addr.district}, {addr.city}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Chưa có địa chỉ nào.</p>
                        )}

                        {showAddressForm && (
                            <div className="mt-6 border-t pt-4">
                                <h3 className="font-semibold mb-2">Thêm địa chỉ mới</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                    <input className="border px-3 py-2 rounded" placeholder="Tỉnh/Thành phố"
                                           value={newAddress.city}
                                           onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}/>
                                    <input className="border px-3 py-2 rounded" placeholder="Quận/Huyện"
                                           value={newAddress.district}
                                           onChange={(e) => setNewAddress({...newAddress, district: e.target.value})}/>
                                    <input className="border px-3 py-2 rounded" placeholder="Phường/Xã"
                                           value={newAddress.ward}
                                           onChange={(e) => setNewAddress({...newAddress, ward: e.target.value})}/>
                                    <input className="border px-3 py-2 rounded" placeholder="Ấp/Thôn"
                                           value={newAddress.hamlet}
                                           onChange={(e) => setNewAddress({...newAddress, hamlet: e.target.value})}/>
                                    <input className="border px-3 py-2 rounded md:col-span-2"
                                           placeholder="Số nhà, đường" value={newAddress.street}
                                           onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}/>
                                </div>
                                <button
                                    onClick={handleAddAddress}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                >
                                    HOÀN THÀNH
                                </button>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'orders' && (
                    <>
                        <h2 className="text-xl font-semibold mb-4">Quản lý đơn hàng</h2>
                        {orders && orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order.orderId} className="border-b pb-4">
                                        <div><strong>Mã đơn hàng:</strong> {order.orderId}</div>
                                        <div>
                                            <strong>Ngày đặt:</strong>{' '}
                                            {new Date(order.createdAt).toLocaleString('vi-VN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false,
                                            })}
                                        </div>
                                        <div><strong>Tổng giá trị:</strong> {order.totalAmount.toLocaleString()}₫</div>
                                        <div><strong>Trạng thái:</strong> {getOrderStatusText(order.status)}</div>
                                        <div className="mt-2 pl-4">
                                            {order.orderItems?.map((item, idx) => (
                                                <div key={idx} className="text-sm border-b py-1 flex justify-between">
                                                    <span>{item.productName} (x{item.quantity})</span>
                                                    <span>{item.price.toLocaleString()}₫</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Chưa có đơn hàng nào.</p>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}
