'use client';

import React, {useState} from 'react';
import {GoogleLogin, CredentialResponse} from '@react-oauth/google';
import axiosClient from '@/lib/axiosClient';
import {handleErrorResponse} from '@/lib/errorHandler';
import Swal from 'sweetalert2';

interface CustomerData {
    accessToken: string;
    customerName: string;
    customerId: number;
    refreshToken: string;
    accessTokenExpires: number;
    email: string;
}

interface LoginPopupProps {
    onClose: () => void;
    onLoginSuccess: (customer: CustomerData) => void;
    onShowSignupPopup: () => void;
}

export default function LoginPopup({
                                       onClose,
                                       onLoginSuccess,
                                       onShowSignupPopup,
                                   }: LoginPopupProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            Swal.fire('Đăng nhập thất bại');
            return;
        }

        setLoading(true);
        try {
            const res = await axiosClient.post('/api/v1/customer/google-login', {
                idToken: credentialResponse.credential,
            });

            const customerData: CustomerData = res.data;
            onLoginSuccess(customerData);
            onClose();
        } catch (error: unknown) {
            const message = handleErrorResponse(error);
            Swal.fire('Lỗi', message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        Swal.fire('Đăng nhập thất bại');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axiosClient.post('/api/v1/customer/login', {
                email,
                password,
            });

            if (!res.data) {
                Swal.fire('Đăng nhập thất bại');
                setLoading(false);
                return;
            }

            const customerData: CustomerData = res.data;
            onLoginSuccess(customerData);
            onClose();
        } catch (error: unknown) {
            const message = handleErrorResponse(error);
            Swal.fire('Lỗi', message, 'error');
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
                    aria-label="Đóng popup đăng nhập"
                    disabled={loading}
                >
                    &times;
                </button>

                <h2 className="text-center font-bold mb-4">ĐĂNG NHẬP HOẶC TẠO TÀI KHOẢN</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Mật khẩu"
                            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-2.5 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                            disabled={loading}
                        >
                            {showPassword ? 'Ẩn' : 'Hiện'}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className={`bg-red-600 text-white font-semibold py-2 rounded transition ${
                            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                        }`}
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
                    </button>
                </form>

                <div className="flex items-center gap-2 mb-4">
                    <hr className="flex-grow border-gray-300"/>
                    <span className="text-gray-400 text-sm whitespace-nowrap">hoặc đăng nhập bằng</span>
                    <hr className="flex-grow border-gray-300"/>
                </div>

                <div className="flex justify-center">
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError}/>
                </div>

                <p className="text-center mt-4 text-sm">
                    Bạn chưa có tài khoản?{' '}
                    <button onClick={onShowSignupPopup} className="text-blue-600 hover:underline cursor-pointer">
                        Đăng ký ngay!
                    </button>
                </p>
            </div>
        </div>
    );
}
