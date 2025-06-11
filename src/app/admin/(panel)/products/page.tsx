'use client'

import {useEffect, useState, useMemo} from 'react'
import axiosClient from '@/lib/axiosClient'
import Link from 'next/link'
import Swal from 'sweetalert2'

interface Product {
    id: number
    productName: string
    price: number
    discount: number
    isActive: boolean
    imageUrl: string
    createdAt: string
}

type SortBy = 'createdAt' | 'price';
type SortOrder = 'asc' | 'desc';

export default function AdminProductPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)

    // Pagination
    const [pageNumber, setPageNumber] = useState(1)
    const pageSize = 10

    // Filters
    const [searchName, setSearchName] = useState('')
    const [priceFrom, setPriceFrom] = useState('')
    const [priceTo, setPriceTo] = useState('')
    const [isActive, setIsActive] = useState('')

    // Sorting
    const [sortBy, setSortBy] = useState<SortBy>('createdAt');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const res = await axiosClient.get<Product[]>('/api/v1/products/admin')
            setProducts(res.data)
        } catch (err) {
            console.error('Lỗi khi tải sản phẩm', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const filteredProducts = useMemo(() => {
        return products
            .filter(p =>
                p.productName.toLowerCase().includes(searchName.toLowerCase()) &&
                (priceFrom === '' || p.price >= parseInt(priceFrom)) &&
                (priceTo === '' || p.price <= parseInt(priceTo)) &&
                (isActive === '' || p.isActive === (isActive === 'true'))
            )
            .sort((a, b) => {
                const valueA = sortBy === 'price' ? a.price : new Date(a.createdAt).getTime()
                const valueB = sortBy === 'price' ? b.price : new Date(b.createdAt).getTime()
                return sortOrder === 'asc' ? valueA - valueB : valueB - valueA
            })
    }, [products, searchName, priceFrom, priceTo, isActive, sortBy, sortOrder])

    const totalPages = Math.ceil(filteredProducts.length / pageSize)
    const paginatedProducts = filteredProducts.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)

    const handleDelete = async (id: number) => {
        const confirm = await Swal.fire({
            title: 'Bạn chắc chắn muốn xoá?',
            text: `ID: ${id}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xoá',
            cancelButtonText: 'Huỷ'
        })

        if (!confirm.isConfirmed) return

        try {
            await axiosClient.delete(`/api/v1/products/${id}`)
            Swal.fire('Đã xoá', '', 'success')
            fetchProducts()
        } catch (err) {
            Swal.fire('Lỗi', 'Không thể xoá sản phẩm', 'error')
        }
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">📦 Quản lý sản phẩm</h2>

            {/* Bộ lọc */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Tìm theo tên"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="border px-3 py-2 rounded"
                />
                <input
                    type="number"
                    placeholder="Giá từ"
                    value={priceFrom}
                    onChange={(e) => setPriceFrom(e.target.value)}
                    className="border px-3 py-2 rounded"
                />
                <input
                    type="number"
                    placeholder="Giá đến"
                    value={priceTo}
                    onChange={(e) => setPriceTo(e.target.value)}
                    className="border px-3 py-2 rounded"
                />
                <select
                    value={isActive}
                    onChange={(e) => setIsActive(e.target.value)}
                    className="border px-3 py-2 rounded"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="true">Đang bán</option>
                    <option value="false">Ngừng bán</option>
                </select>
            </div>

            {/* Sắp xếp */}
            <div className="flex items-center gap-4 mb-4">
                <label className="text-sm">Sắp xếp theo:</label>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="border px-3 py-2 rounded"
                >
                    <option value="createdAt">Ngày tạo</option>
                    <option value="price">Giá</option>
                </select>

                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                    className="border px-3 py-2 rounded"
                >
                    <option value="desc">Giảm dần 🔽</option>
                    <option value="asc">Tăng dần 🔼</option>
                </select>
            </div>

            {/* Thêm sản phẩm */}
            <div className="mb-4">
                <Link
                    href="/admin/products/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    ➕ Thêm sản phẩm
                </Link>
            </div>

            {/* Bảng sản phẩm */}
            <table className="w-full table-auto border-collapse border text-sm bg-white rounded shadow">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Hình</th>
                    <th className="border p-2">Tên</th>
                    <th className="border p-2">Giá gốc</th>
                    <th className="border p-2">% Giảm</th>
                    <th className="border p-2 text-red-600">Giá sau giảm</th>
                    <th className="border p-2">Trạng thái</th>
                    <th className="border p-2">Ngày tạo</th>
                    <th className="border p-2">Thao tác</th>
                </tr>
                </thead>
                <tbody>
                {loading ? (
                    <tr>
                        <td colSpan={9} className="text-center p-4">Đang tải...</td>
                    </tr>
                ) : paginatedProducts.length === 0 ? (
                    <tr>
                        <td colSpan={9} className="text-center p-4">Không có sản phẩm</td>
                    </tr>
                ) : (
                    paginatedProducts.map((p) => {
                        const imageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${p.imageUrl}`
                        const newPrice = p.price - (p.price * p.discount) / 100

                        return (
                            <tr key={p.id}>
                                <td className="border p-2">{p.id}</td>
                                <td className="border p-2">
                                    <img src={imageUrl} alt={p.productName} className="w-16 h-16 object-cover rounded"/>
                                </td>
                                <td className="border p-2">{p.productName}</td>
                                <td className="border p-2">{p.price.toLocaleString()} đ</td>
                                <td className="border p-2">{p.discount}%</td>
                                <td className="border p-2 text-red-600">{newPrice.toLocaleString()} đ</td>
                                <td className="border p-2">{p.isActive ? '✅ Đang bán' : '⛔ Ngừng bán'}</td>
                                <td className="border p-2">{new Date(p.createdAt).toLocaleDateString()}</td>
                                <td className="border p-2 space-x-2">
                                    <Link
                                        href={`/admin/products/edit/${p.id}`}
                                        className="text-blue-600 underline"
                                    >
                                        Sửa
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Ngừng bán
                                    </button>
                                </td>
                            </tr>
                        )
                    })
                )}
                </tbody>
            </table>

            {/* Phân trang */}
            <div className="flex justify-between items-center mt-4">
                <div>Trang {pageNumber}/{totalPages}</div>
                <div className="space-x-2">
                    <button
                        disabled={pageNumber <= 1}
                        onClick={() => setPageNumber(p => Math.max(p - 1, 1))}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        ◀ Trước
                    </button>
                    <button
                        disabled={pageNumber >= totalPages}
                        onClick={() => setPageNumber(p => p + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Tiếp ▶
                    </button>
                </div>
            </div>
        </div>
    )
}
