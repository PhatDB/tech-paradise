'use client'

import {useEffect, useState} from 'react'
import axiosClient from '@/lib/axiosClient'
import {
    FaBox, FaUsers, FaShoppingCart, FaStar,
    FaMoneyBillWave, FaChartLine, FaFire, FaEye
} from 'react-icons/fa'
import {
    BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

interface DashboardStats {
    totalProducts: number
    totalCustomers: number
    totalOrders: number
    totalReviews: number
    monthlyRevenue: number
    monthlySales: number
    dailyRevenue: number
    dailySales: number
    totalViews: number
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [productsRes, customersRes, ordersRes] = await Promise.all([
                    axiosClient.get('/api/v1/products/total'),
                    axiosClient.get('/api/v1/customers/dashboard'),
                    axiosClient.get('/api/v1/orders/dashboard'),
                ])

                setStats({
                    totalProducts: productsRes.data.totalProduct,
                    totalCustomers: customersRes.data.totalCustomers,
                    totalOrders: ordersRes.data.monthlySales,
                    totalReviews: customersRes.data.totalReviews,
                    monthlyRevenue: ordersRes.data.monthlyRevenue,
                    monthlySales: ordersRes.data.monthlySales,
                    dailyRevenue: ordersRes.data.dailyRevenue,
                    dailySales: ordersRes.data.dailySales,
                    totalViews: 0
                })
            } catch {
                setStats(null)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    if (loading) return <div className="p-6">⏳ Đang tải dữ liệu thống kê...</div>

    if (!stats) return <div className="p-6 text-red-600">⚠️ Không thể tải dữ liệu dashboard.</div>

    const chartData = [
        {name: 'Sản phẩm', value: stats.totalProducts},
        {name: 'Người dùng', value: stats.totalCustomers},
        {name: 'Đơn hàng', value: stats.totalOrders},
        {name: 'Đánh giá', value: stats.totalReviews},
    ]

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042']

    return (
        <div className="p-6 space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard icon={<FaBox className="text-blue-600" size={28}/>} label="Sản phẩm"
                               value={stats.totalProducts}/>
                <DashboardCard icon={<FaUsers className="text-green-600" size={28}/>} label="Người dùng"
                               value={stats.totalCustomers}/>
                <DashboardCard icon={<FaShoppingCart className="text-yellow-600" size={28}/>}
                               label="Đơn hàng trong tháng" value={stats.totalOrders}/>
                <DashboardCard icon={<FaStar className="text-purple-600" size={28}/>} label="Đánh giá"
                               value={stats.totalReviews}/>
                <DashboardCard icon={<FaMoneyBillWave className="text-emerald-600" size={28}/>} label="Doanh thu tháng"
                               value={stats.monthlyRevenue.toLocaleString() + ' ₫'}/>
                <DashboardCard icon={<FaChartLine className="text-pink-600" size={28}/>} label="Doanh thu hôm nay"
                               value={stats.dailyRevenue.toLocaleString() + ' ₫'}/>
                <DashboardCard icon={<FaFire className="text-orange-600" size={28}/>} label="Bán trong ngày"
                               value={stats.dailySales}/>
                <DashboardCard icon={<FaEye className="text-gray-600" size={28}/>} label="Lượt truy cập"
                               value={stats.totalViews}/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="font-bold text-lg mb-4">Biểu đồ cột: Tổng quan</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name"/>
                            <YAxis allowDecimals={false}/>
                            <Tooltip/>
                            <Legend/>
                            <Bar dataKey="value" fill="#8884d8"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h2 className="font-bold text-lg mb-4">Biểu đồ tròn: Phân bổ</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                ))}
                            </Pie>
                            <Tooltip/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

function DashboardCard({icon, label, value}: { icon: React.ReactNode, label: string, value: string | number }) {
    return (
        <div className="bg-white rounded shadow p-4 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-gray-100">
                {icon}
            </div>
            <div>
                <div className="text-lg font-semibold">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
            </div>
        </div>
    )
}