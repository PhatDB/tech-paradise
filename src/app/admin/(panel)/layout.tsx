'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import clsx from 'clsx';
import AdminAuthWrapper from '@/middleware/AdminAuthWrapper';

const navItems = [
    {href: '/admin/dashboard', label: '📊 Dashboard'},
    {href: '/admin/products', label: '📦 Sản phẩm'},
    {href: '/admin/orders', label: '🛒 Đơn hàng'},
    {href: '/admin/users', label: '👥 Người dùng'},
    {href: '/admin/reviews', label: '💬 Đánh giá'},
];

export default function AdminLayout({children}: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AdminAuthWrapper>
            <div className="min-h-screen flex bg-gray-100 text-gray-800">
                <aside className="w-64 bg-gray-900 text-white flex flex-col">
                    <div className="p-4 font-bold text-xl border-b border-gray-700">🛠️ Admin Panel</div>
                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    'block px-4 py-2 rounded transition-colors duration-200',
                                    pathname.startsWith(item.href)
                                        ? 'bg-gray-700 text-white font-semibold'
                                        : 'hover:bg-gray-800 text-gray-300'
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="p-4 text-sm text-gray-400 border-t border-gray-700">
                        © {new Date().getFullYear()} Admin
                    </div>
                </aside>

                <div className="flex-1 flex flex-col">
                    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
                        <h1 className="text-xl font-semibold">Hệ thống quản trị</h1>
                        <div className="text-sm text-gray-600">Xin chào, Quản trị viên</div>
                    </header>
                    <main className="p-6 bg-gray-100 flex-1 overflow-auto">{children}</main>
                </div>
            </div>
        </AdminAuthWrapper>
    );
}
