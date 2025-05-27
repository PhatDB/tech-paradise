'use client';

import {Minus, Plus} from 'lucide-react';
import {useState} from 'react';
import {cn} from '@/lib/utils';

interface QuantitySelectorProps {
    className?: string;
    value?: number;
    min?: number;
    max?: number;
    onChange?: (value: number) => void;
}

export default function QuantitySelector({
                                             className,
                                             value = 1,
                                             min = 1,
                                             max = 99,
                                             onChange
                                         }: QuantitySelectorProps) {
    const [quantity, setQuantity] = useState<number>(value);

    const updateQuantity = (val: number) => {
        const newVal = Math.max(min, Math.min(max, val));
        setQuantity(newVal);
        onChange?.(newVal);
    };

    return (
        <div className={cn('flex items-center border border-gray-300 rounded-md w-fit', className)}>
            <button
                type="button"
                className="px-3 py-1.5 text-gray-600 hover:text-black disabled:opacity-50"
                onClick={() => updateQuantity(quantity - 1)}
                disabled={quantity <= min}
            >
                <Minus size={16}/>
            </button>
            <span className="px-4 w-8 text-center">{quantity}</span>
            <button
                type="button"
                className="px-3 py-1.5 text-gray-600 hover:text-black disabled:opacity-50"
                onClick={() => updateQuantity(quantity + 1)}
                disabled={quantity >= max}
            >
                <Plus size={16}/>
            </button>
        </div>
    );
}
