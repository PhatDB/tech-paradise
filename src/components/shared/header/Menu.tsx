'use client';

import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from '@/store';
import {setCustomer, logout, Customer} from '@/store/authSlice';
import {ShoppingCartIcon} from 'lucide-react';
import Link from 'next/link';
import useCartCount from '@/hooks/useCartCount';
import LoginPopup from '@/components/ui/LoginPopup';
import SignUpPopup from '@/components/ui/SignUpPopup';
import {LogOut, Eye, PackageOpen, Hand} from 'lucide-react';

export default function Menu() {
    const dispatch = useDispatch<AppDispatch>();
    const customer = useSelector((state: RootState) => state.auth.customer);

    const count = useCartCount(customer?.customerId);

    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showSignUpPopup, setShowSignUpPopup] = useState(false);

    useEffect(() => {
        const storedCustomer = localStorage.getItem('customer');
        if (storedCustomer) {
            try {
                const parsedCustomer: Customer = JSON.parse(storedCustomer);
                dispatch(setCustomer(parsedCustomer));
            } catch {
                localStorage.removeItem('customer');
            }
        }
    }, [dispatch]);

    const handleLoginClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowLoginPopup(true);
    };

    const handleLoginSuccess = (customerData: Customer) => {
        localStorage.setItem('customer', JSON.stringify(customerData));
        dispatch(setCustomer(customerData));
        setShowLoginPopup(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('customer');
        dispatch(logout());
    };

    const handleShowSignUpPopup = () => {
        setShowLoginPopup(false);
        setShowSignUpPopup(true);
    };

    return (
        <>
            <nav className="flex items-center gap-4">
                {customer ? (
                    <div className="relative group">
                        <span className="cursor-pointer header-button text-sm font-medium whitespace-nowrap"
                              onClick={() => window.location.href = '/account'}
                        >
                            Xin chào, {customer.customerName}
                        </span>
                        
                        <div
                            className="absolute z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 delay-100 group-hover:translate-y-1 bg-white shadow-lg border rounded w-60 mt-2 right-0 text-sm text-gray-700"
                        >
                            <div className="px-4 py-3 flex items-center gap-2 font-semibold border-b">
                                <Hand size={18} className="text-yellow-500"/> Xin chào, {customer.customerName}
                            </div>
                            <Link
                                href="/account#order-history"
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                            >
                                <PackageOpen size={18}/> Đơn hàng của tôi
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 transition text-left"
                            >
                                <LogOut size={18}/> Đăng xuất
                            </button>
                        </div>
                    </div>
                ) : (
                    <a
                        href="#"
                        onClick={handleLoginClick}
                        className="flex items-center header-button text-sm font-medium whitespace-nowrap"
                    >
                        Đăng Nhập
                    </a>
                )}

                <Link
                    href="/cart"
                    className="relative flex items-center gap-1 header-button text-sm font-medium"
                >
                    <ShoppingCartIcon className="w-5 h-5"/>
                    <span>Giỏ Hàng</span>

                    {count > 0 && (
                        <span
                            className="absolute -top-2 -right-2 text-xs bg-red-600 text-white px-1.5 py-0.5 rounded-full">
                            {count}
                        </span>
                    )}
                </Link>
            </nav>

            {showLoginPopup && (
                <LoginPopup
                    onClose={() => setShowLoginPopup(false)}
                    onLoginSuccess={handleLoginSuccess}
                    onShowSignupPopup={handleShowSignUpPopup}
                />
            )}

            {showSignUpPopup && (
                <SignUpPopup onClose={() => setShowSignUpPopup(false)}/>
            )}
        </>
    );
}
