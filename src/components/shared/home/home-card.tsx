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
                <Card key={card.title} className="rounded-none flex flex-col h-full">
                    <CardContent className="p-4 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold mb-4">{card.title}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {card.items.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex flex-col items-center"
                                    aria-label={item.name}
                                >
                                    <Image
                                        src={item.image || '/fallback.png'}
                                        alt={item.name}
                                        height={120}
                                        width={120}
                                        className="aspect-square object-contain"
                                    />
                                    <p className="text-center text-sm mt-2 truncate w-full">
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
                                className="text-sm text-blue-600 underline"
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
