'use client';

import {Category} from '@/types/category';
import {ChevronRight} from 'lucide-react';
import MegaMenu from './MegaMenu';
import Link from 'next/link';

interface SidebarMenuProps {
    categories: Category[];
}

export default function SidebarMenu({categories}: SidebarMenuProps) {
    return (
        <div className="relative flex w-full">
            <div className="w-[240px] bg-white border shadow rounded-lg">
                {categories.map((cat) => (
                    <div key={cat.id} className="group relative">
                        <Link
                            href={`/products?category=${encodeURIComponent(cat.categoryName)}`}
                            className="flex justify-between items-center px-4 py-2 hover:bg-red-500 hover:text-white cursor-pointer"
                        >
                            <span className="text-sm font-medium">{cat.categoryName}</span>
                            {cat.subcategories.length > 0 && <ChevronRight size={16}/>}
                        </Link>

                        {cat.subcategories.length > 0 && (
                            <div className="absolute top-0 left-full z-50 hidden group-hover:block w-[1000px] h-full">
                                <MegaMenu subcategories={cat.subcategories}/>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
