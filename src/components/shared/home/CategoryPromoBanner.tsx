'use client'

import Image from 'next/image'
import Link from 'next/link'

interface PromoItem {
    title: string
    imageUrl: string
    href: string
}

const items: PromoItem[] = [
    {
        title: 'Laptop',
        imageUrl: '/images/promo/banner_home_1_master.webp',
        href: '/products?category=Laptop',
    },
    {
        title: 'Màn hình',
        imageUrl: '/images/promo/banner_home_2_master.webp',
        href: '/products?category=Màn hình',
    },
    {
        title: 'Gear',
        imageUrl: '/images/promo/banner_home_3_master.webp',
        href: '/products?category=Gear',
    },
    {
        title: 'Bàn ghế',
        imageUrl: '/images/promo/banner_home_4_master.webp',
        href: '/products?category=Ghế - Bàn',
    },
]

export default function CategoryPromoBanner() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item, index) => (
                <Link
                    key={index}
                    href={item.href}
                    className="block overflow-hidden rounded-lg hover:scale-[1.01] transition-transform duration-200 ease-in-out"
                >
                    <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={600}
                        height={250}
                        className="w-full h-auto object-cover rounded-lg"
                        priority
                    />
                </Link>
            ))}
        </div>
    )
}
