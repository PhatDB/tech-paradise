'use client';

import Image from 'next/image';
import Link from 'next/link';
import {ChevronLeft, ChevronRight, Star} from 'lucide-react';
import React from 'react';
import {BestSellerPC} from '@/types/bestSellerPC';

import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Autoplay} from 'swiper/modules';

// ✅ Import bắt buộc để Swiper hoạt động
import 'swiper/css';
import 'swiper/css/navigation';

interface BestSellerPcListProps {
    products: BestSellerPC[];
}

export function BestSellerPcList({products}: BestSellerPcListProps) {
    return (
        <div className="relative">
            <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                loop
                navigation={{
                    nextEl: '.swiper-custom-next',
                    prevEl: '.swiper-custom-prev',
                }}
                autoplay={{delay: 4000}}
                breakpoints={{
                    640: {slidesPerView: 2},
                    768: {slidesPerView: 3},
                    1024: {slidesPerView: 5},
                }}
            >
                {products.map((pc) => (
                    <SwiperSlide key={pc.name}>
                        <Link href={pc.href} className="product-card">
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
                                <span className="ml-1 text-gray-500">
                  ({pc.reviewCount} đánh giá)
                </span>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom arrows */}
            <div className="swiper-custom-prev absolute top-1/2 -left-2 z-10 transform -translate-y-1/2">
                <div
                    className="w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 cursor-pointer">
                    <ChevronLeft size={20}/>
                </div>
            </div>
            <div className="swiper-custom-next absolute top-1/2 -right-2 z-10 transform -translate-y-1/2">
                <div
                    className="w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 cursor-pointer">
                    <ChevronRight size={20}/>
                </div>
            </div>
        </div>
    );
}
