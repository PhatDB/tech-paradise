'use client';

import {useState} from 'react';
import axiosClient from '@/lib/axiosClient';
import Swal from 'sweetalert2';
import {handleErrorResponse} from '@/lib/errorHandler';

interface SignUpPopupProps {
    onClose: () => void;
}

export default function SignUpPopup({onClose}: SignUpPopupProps) {
    const [customerName, setCustomerName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axiosClient.post('/api/v1/customer/register', {
                customerName,
                email,
                password,
            });

            if (res.status === 200 || res.status === 201) {
                Swal.fire('Đăng ký thành công!', 'Tạo tài khoản thành công', 'success');
                onClose();
            }
        } catch (error: unknown) {
            const errorMessage = handleErrorResponse(error);
            Swal.fire('Lỗi', errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-transparent z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full relative shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                    aria-label="Đóng popup đăng ký"
                    disabled={loading}
                >
                    &times;
                </button>

                <h2 className="text-center font-bold mb-4">ĐĂNG KÝ TÀI KHOẢN</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Họ và tên"
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        className={`bg-red-600 text-white font-semibold py-2 rounded transition ${
                            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                        }`}
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng ký...' : 'ĐĂNG KÝ'}
                    </button>
                </form>
            </div>
        </div>
    );
}
