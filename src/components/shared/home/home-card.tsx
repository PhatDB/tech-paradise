'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {Card, CardContent, CardFooter} from '@/components/ui/card';
import {CardItem} from '@/types';

interface HomeCardProps {
    cards: CardItem[];
}

export function HomeCard({cards}: HomeCardProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
                <Card key={card.title} className="rounded-md shadow-sm flex flex-col h-full">
                    <CardContent className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                            {card.title}
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {card.items.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex flex-col items-center text-center hover:opacity-90 transition"
                                    aria-label={item.name}
                                >
                                    <Image
                                        src={item.image || '/fallback.png'}
                                        alt={item.name}
                                        height={100}
                                        width={100}
                                        className="object-contain aspect-square rounded"
                                    />
                                    <p className="text-sm mt-2 truncate text-gray-700 dark:text-gray-200 w-full">
                                        {item.name}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </CardContent>

                    {card.link && (
                        <CardFooter className="pt-2">
                            <Link
                                href={card.link.href}
                                className="text-sm text-primary hover:underline"
                            >
                                {card.link.text}
                            </Link>
                        </CardFooter>
                    )}
                </Card>
            ))}
        </div>
    );
}