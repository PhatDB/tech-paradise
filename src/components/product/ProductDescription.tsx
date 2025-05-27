'use client'

import {useState, useRef, useEffect} from 'react'
import {cn} from '@/lib/utils'

interface ProductDescriptionProps {
    description: string
    maxHeight?: number
}

export default function ProductDescription({
                                               description,
                                               maxHeight = 144,
                                           }: ProductDescriptionProps) {
    const [expanded, setExpanded] = useState(false)
    const [isOverflowing, setIsOverflowing] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = contentRef.current
        if (el && el.scrollHeight > maxHeight) {
            setIsOverflowing(true)
        }
    }, [description, maxHeight])

    const toggleExpanded = () => setExpanded(!expanded)

    return (
        <div className="mt-10 bg-white rounded p-4 shadow">
            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-4">Mô tả sản phẩm</h2>

                <div
                    ref={contentRef}
                    className={cn(
                        'text-sm text-gray-700 whitespace-pre-line leading-relaxed transition-all duration-300 ease-in-out overflow-hidden',
                        expanded ? 'max-h-[2000px]' : `max-h-[${maxHeight}px]`
                    )}
                    style={{
                        maxHeight: expanded ? '2000px' : `${maxHeight}px`,
                    }}
                >
                    {description}
                </div>

                {isOverflowing && (
                    <button
                        onClick={toggleExpanded}
                        className="mt-2 text-blue-600 hover:underline text-sm font-medium"
                    >
                        {expanded ? 'Thu gọn' : 'Xem thêm'}
                    </button>
                )}
            </div>
        </div>
    )
}
