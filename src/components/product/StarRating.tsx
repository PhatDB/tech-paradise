'use client'

import {Star} from 'lucide-react'
import clsx from 'clsx'

interface StarRatingProps {
    rating: number
    onChange?: (value: number) => void
    interactive?: boolean
    className?: string
}

export function StarRating({rating, onChange, interactive = false, className}: StarRatingProps) {
    const handleClick = (value: number) => {
        if (interactive && onChange) onChange(value)
    }

    return (
        <div className={clsx('flex items-center', className)}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={clsx('w-5 h-5 cursor-pointer transition-colors', {
                        'text-yellow-400': star <= rating,
                        'text-gray-300': star > rating,
                        'hover:text-yellow-500': interactive,
                    })}
                    fill={star <= rating ? 'currentColor' : 'none'}
                    onClick={() => handleClick(star)}
                />
            ))}
        </div>
    )
}
