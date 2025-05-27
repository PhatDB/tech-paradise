'use client';

import Image from 'next/image';
import Link from 'next/link';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Autoplay} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import {Product} from '@/types/product';
import {formatCurrency} from '@/lib/format';
import {StarRating} from '@/components/product/StarRating';

interface ProductCarouselProps {
    products: Product[];
    carouselId: string;
}

export function ProductCarousel({products, carouselId}: ProductCarouselProps) {
    if (!products?.length) return null;

    const nextClass = `.swiper-next-${carouselId}`;
    const prevClass = `.swiper-prev-${carouselId}`;

    return (
        <div className="relative">
            <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                loop
                navigation={{nextEl: nextClass, prevEl: prevClass}}
                autoplay={{delay: 4000}}
                breakpoints={{
                    640: {slidesPerView: 2},
                    768: {slidesPerView: 3},
                    1024: {slidesPerView: 5},
                }}
            >
                {products.map((product) => {
                    const newPrice = product.price - (product.price * product.discount) / 100;
                    const imageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.imageUrl}`;

                    return (
                        <SwiperSlide key={product.id}>
                            <Link href={`/products/${product.id}`} className="product-card">
                                <div className="w-full h-48 relative mb-2">
                                    <Image
                                        src={imageUrl}
                                        alt={product.productName}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 20vw"
                                        className="object-contain rounded-md"
                                    />
                                </div>

                                <h3 className="text-sm font-medium truncate mb-1">
                                    {product.productName}
                                </h3>

                                <StarRating rating={product.rating} className="mb-2"/>
                                <span className="text-xs text-gray-500 ml-1">({product.rating.toFixed(1)})</span>

                                <div className="flex flex-wrap gap-1 mb-2">
                                    {product.specs.split(',').slice(0, 3).map((spec, index) => (
                                        <span key={index} className="bg-gray-100 text-xs px-2 py-1 rounded">
                      {spec.trim()}</span>
                                    ))}
                                </div>
                                <div className="text-sm">
                                    {product.discount > 0 ? (
                                        <>
                      <span className="line-through text-gray-400 mr-2">
                        {formatCurrency(product.price)}
                      </span>
                                            <span className="text-red-600 font-semibold">
                        {formatCurrency(newPrice)}
                      </span>
                                            <span
                                                className="ml-2 text-red-600 border border-red-600 px-1.5 py-0.5 text-xs rounded font-semibold">
                        -{product.discount}%
                      </span>
                                        </>
                                    ) : (
                                        <span className="text-black font-semibold">
                      {formatCurrency(product.price)}
                    </span>
                                    )}
                                </div>
                            </Link>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            <div className={`swiper-prev-${carouselId} absolute top-1/2 -left-3 z-10 -translate-y-1/2`}>
                <div
                    className="w-8 h-8 bg-white shadow rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer">
                    <ChevronLeft size={20}/>
                </div>
            </div>
            <div className={`swiper-next-${carouselId} absolute top-1/2 -right-3 z-10 -translate-y-1/2`}>
                <div
                    className="w-8 h-8 bg-white shadow rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer">
                    <ChevronRight size={20}/>
                </div>
            </div>
        </div>
    );
}
