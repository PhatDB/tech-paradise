'use client'

import {ShoppingCartIcon} from 'lucide-react'
import Link from 'next/link'
import useCartCount from "@/hooks/useCartCount"

export default function Menu() {
    const count = useCartCount()

    return (
        <nav className="flex items-center gap-4">
            <Link
                href="/signin"
                className="flex items-center header-button text-sm font-medium whitespace-nowrap"
            >
                Hello, Sign in
            </Link>

            <Link
                href="/cart"
                className="relative flex items-center gap-1 header-button text-sm font-medium"
            >
                <ShoppingCartIcon className="w-5 h-5"/>
                <span>Cart</span>

                {count > 0 && (
                    <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white px-1.5 py-0.5 rounded-full">
            {count}
          </span>
                )}
            </Link>
        </nav>
    )
}
