'use client'
import Image from 'next/image'
import Link from 'next/link'
import {Category} from "@/types/category";

interface ProductCategoryGridProps {
    categories: Category[]
}

export default function ProductCategoryGrid({categories}: ProductCategoryGridProps) {
    return (
        <section className="bg-white p-6 rounded-md shadow">
            <h2 className="text-2xl font-bold mb-4">Danh mục sản phẩm</h2>
            <hr className="mb-6"/>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
                {categories.map((cat) => (
                    <Link
                        href={`/products?category=${encodeURIComponent(cat.categoryName)}`}
                        key={cat.categoryName}
                        className="flex flex-col items-center text-center hover:text-red-600 transition"
                    >
                        <div className="w-16 h-16 relative mb-2">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${cat.imageUrl}`}
                                alt={cat.categoryName}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-sm font-medium">{cat.categoryName}</span>
                    </Link>
                ))}
            </div>
        </section>
    )
}
