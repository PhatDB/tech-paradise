import {ShoppingCartIcon} from 'lucide-react';
import Link from 'next/link';

export default function Menu() {
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
                className="flex items-center gap-1 header-button text-sm font-medium"
            >
                <ShoppingCartIcon className="w-5 h-5"/>
                <span>Cart</span>
            </Link>
        </nav>
    );
}
