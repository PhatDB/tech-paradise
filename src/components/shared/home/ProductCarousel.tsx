'use client';

import Image from 'next/image';
import Link from 'next/link';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import React from 'react';
import {Product} from '@/types/product';

import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Autoplay} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

interface ProductCarouselProps {
    products: Product[];
}

export function ProductCarousel({products}: ProductCarouselProps) {
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
                {products.map((pc) => {
                    const newPrice = pc.price - (pc.price * pc.discount) / 100;

                    return (
                        <SwiperSlide key={pc.id}>
                            <Link href="" className="product-card">
                                <Image
                                    src={pc.imageUrl}
                                    alt={pc.productName}
                                    width={300}
                                    height={300}
                                    className="product-card-image"
                                />
                                <h3 className="product-card-title">{pc.productName}</h3>

                                <div className="flex flex-wrap gap-1">
                                    {pc.specs.split(',').map((spec, index) => (
                                        <span key={index} className="product-spec-badge">
                      {spec.trim()}
                    </span>
                                    ))}
                                </div>

                                <div className="product-price">
                  <span className="product-price-old">
                    {pc.price.toLocaleString()}₫
                  </span>
                                    <span className="product-price-new">
                    {newPrice.toLocaleString()}₫
                  </span>
                                    <span className="product-price-discount">
                    -{pc.discount}%
                  </span>
                                </div>
                            </Link>
                        </SwiperSlide>
                    );
                })}
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
