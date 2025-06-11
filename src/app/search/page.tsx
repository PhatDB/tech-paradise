'use client';

import {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import axiosClient from '@/lib/axiosClient';
import {Product, ProductResponse} from '@/types/product';
import {ProductCard} from "@/components/product/ProductCard";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const keyword = searchParams.get('q') ?? '';
    const categoryId = searchParams.get('categoryId') ?? '';

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 8;

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                pageNumber: page.toString(),
                pageSize: pageSize.toString(),
                sortBy: 'sold_quantity',
                isDescending: 'true',
            });

            if (keyword) queryParams.append('keyword', keyword);
            if (categoryId) queryParams.append('categoryId', categoryId);

            const res = await axiosClient.get<ProductResponse>(
                `/api/v1/products/filter?${queryParams.toString()}`
            );

            setProducts(res.data.data);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [keyword, categoryId, page]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-2 text-center">TÌM KIẾM</h1>
            <p className="text-center text-gray-600 mb-6">
                {keyword && <>Kết quả cho từ khóa: <span className="font-semibold">{keyword}</span></>}
                {categoryId && <> Danh mục: <span className="font-semibold">{categoryId}</span></>}
            </p>

            {loading ? (
                <p className="text-center py-10">Đang tải kết quả...</p>
            ) : products.length === 0 ? (
                <p className="text-center text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product}/>
                        ))}
                    </div>

                    <div className="flex justify-center mt-6 gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            disabled={page === 1}
                        >
                            Trước
                        </button>
                        <span className="px-3 py-1 text-sm">
                            Trang {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            disabled={page === totalPages}
                        >
                            Sau
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
