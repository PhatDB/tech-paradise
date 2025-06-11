import Link from 'next/link'
import {Subcategory} from '@/types/category'

interface MegaMenuProps {
    subcategories: Subcategory[]
}

export default function MegaMenu({subcategories}: MegaMenuProps) {
    return (
        <div className="h-full bg-white shadow-lg border-l p-6 rounded-r-lg grid grid-cols-5 gap-6">
            {subcategories.map((group) => (
                <div key={group.id} className="flex flex-col space-y-2">
                    <Link
                        href={`/search?categoryId=${group.id}`}
                        className="text-red-600 font-semibold text-sm hover:underline"
                    >
                        {group.categoryName}
                    </Link>
                    <ul className="space-y-1">
                        {group.subcategories.map((item) => (
                            <li key={item.id}>
                                <Link
                                    href={`/search?categoryId=${encodeURIComponent(item.id)}`}
                                    className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer"
                                >
                                    {item.categoryName}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}
