'use client';

import Image from 'next/image';
import Link from 'next/link';
import {Star} from 'lucide-react';
import React from 'react';
import {BestSellerPC} from "@/types/bestSellerPC";

interface BestSellerPcListProps {
    products: BestSellerPC[];
}

export function BestSellerPcList({products}: BestSellerPcListProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((pc) => (
                <Link href={pc.href} key={pc.name} className="product-card">
                    <Image
                        src={pc.image}
                        alt={pc.name}
                        width={300}
                        height={300}
                        className="product-card-image"
                    />
                    <h3 className="product-card-title">{pc.name}</h3>

                    <div className="flex flex-wrap gap-1">
                        {pc.specs.map((spec, i) => (
                            <span key={i} className="product-spec-badge">
                                {spec}
                            </span>
                        ))}
                    </div>

                    <div className="product-price">
                        <span className="product-price-old">
                            {pc.oldPrice.toLocaleString()}₫
                        </span>
                        <span className="product-price-new">
                            {pc.newPrice.toLocaleString()}₫
                        </span>
                        <span className="product-price-discount">
                            -{pc.discountPercent}%
                        </span>
                    </div>
                    <div className="product-rating">
                        <Star size={14} className="fill-current"/>
                        <span className="ml-1 font-semibold">{pc.rating.toFixed(1)}</span>
                        <span className="ml-1 text-gray-500">({pc.reviewCount} đánh giá)</span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
