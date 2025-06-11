'use client';

import {useEffect, useState} from 'react';
import axiosClient from '@/lib/axiosClient';

interface Address {
    addressId: number;
    street: string;
    hamlet: string;
    ward: string;
    district: string;
    city: string;
}

interface Customer {
    customerId: number;
    customerName: string;
    email: string;
    phone: string | null;
    address: Address[];
}

export default function AdminUserPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await axiosClient.get('/api/v1/customers');
                setCustomers(res.data);
            } catch (err) {
                console.error('Lỗi khi tải danh sách người dùng:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    if (loading) return <div className="p-6">⏳ Đang tải danh sách người dùng...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">👥 Quản lý người dùng</h1>
            <table className="min-w-full table-auto border border-gray-300 bg-white shadow-md rounded">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-3 text-left border-b">ID</th>
                    <th className="p-3 text-left border-b">Tên</th>
                    <th className="p-3 text-left border-b">Email</th>
                    <th className="p-3 text-left border-b">SĐT</th>
                    <th className="p-3 text-left border-b">Địa chỉ</th>
                </tr>
                </thead>
                <tbody>
                {customers.map((c) => (
                    <tr key={c.customerId} className="hover:bg-gray-50">
                        <td className="p-3 border-b">#{c.customerId}</td>
                        <td className="p-3 border-b">{c.customerName}</td>
                        <td className="p-3 border-b">{c.email}</td>
                        <td className="p-3 border-b">{c.phone || '—'}</td>
                        <td className="p-3 border-b text-sm">
                            {c.address.length > 0 ? (
                                <ul className="list-disc pl-4 space-y-1">
                                    {c.address.map((a) => (
                                        <li key={a.addressId}>
                                            {a.street}, {a.hamlet}, {a.ward}, {a.district}, {a.city}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <span className="italic text-gray-500">Không có địa chỉ</span>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
