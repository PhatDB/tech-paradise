'use client'

import {useState} from 'react'
import {StarRating} from '@/components/product/StarRating'
import {Textarea} from '@/components/ui/Textarea'
import {Button} from '@/components/ui/Button'

interface ReviewFormProps {
    productId: number
    onSubmit?: (data: { rating: number; comment: string }) => void
}

export default function ReviewForm({productId, onSubmit}: ReviewFormProps) {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (rating === 0 || comment.trim() === '') return

        setSubmitting(true)
        try {
            // Gọi callback hoặc gửi lên server
            if (onSubmit) {
                await onSubmit({rating, comment})
            } else {
                console.log({productId, rating, comment})
                // TODO: Gửi request lên API thực tế
            }
            setComment('')
            setRating(0)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 bg-gray-50 p-4 rounded-md border">
            <div>
                <label className="block text-sm font-medium mb-1">Đánh giá của bạn</label>
                <StarRating rating={rating} onChange={setRating} interactive/>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Nội dung đánh giá</label>
                <Textarea
                    placeholder="Viết nội dung đánh giá..."
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                />
            </div>

            <Button type="submit" disabled={submitting || rating === 0 || comment.trim() === ''}>
                {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </Button>
        </form>
    )
}
