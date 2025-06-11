'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import axiosClient from '@/lib/axiosClient';
import Swal from 'sweetalert2';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.post('/api/v1/customer/login', {email, password});
            const data = res.data;

            if (!data || data.role !== 'Admin') {
                Swal.fire('Từ chối truy cập', 'Tài khoản không có quyền Admin!', 'error');
                return;
            }

            localStorage.setItem('admin_token', data.accessToken);
            localStorage.setItem('admin_name', data.customerName);
            localStorage.setItem('admin_role', data.role);

            Swal.fire('Thành công', 'Đăng nhập thành công', 'success');
            router.push('/admin/dashboard');
        } catch (err) {
            Swal.fire('Đăng nhập thất bại', 'Email hoặc mật khẩu không đúng', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow w-full max-w-sm">
                <h2 className="text-xl font-semibold mb-6 text-center">🔐 Đăng nhập Admin</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-3 rounded mb-4"
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-3 rounded mb-6"
                />
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
                >
                    {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                </button>
            </div>
        </div>
    );
}