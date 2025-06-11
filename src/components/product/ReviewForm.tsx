'use client'

import {useState} from 'react'
import {useSelector} from 'react-redux'
import {RootState} from '@/store'
import axiosClient from '@/lib/axiosClient'
import {StarRating} from '@/components/product/StarRating'
import {Textarea} from '@/components/ui/Textarea'
import {Button} from '@/components/ui/Button'
import Swal from 'sweetalert2'
import {handleErrorResponse} from '@/lib/errorHandler'

interface ReviewFormProps {
    productId: number
    onSubmitSuccess: () => void
}

export default function ReviewForm({productId, onSubmitSuccess}: ReviewFormProps) {
    const customerId = useSelector((state: RootState) => state.auth.customer?.customerId ?? null)

    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!customerId) {
            Swal.fire('Vui lòng đăng nhập để đánh giá sản phẩm.')
            return
        }

        if (rating === 0 || comment.trim() === '') return

        setSubmitting(true)
        try {
            await axiosClient.post('/api/v1/customer/review', {
                customerId,
                productId,
                rating,
                comment
            })

            Swal.fire('🎉 Đánh giá đã được gửi!', '', 'success')
            setRating(0)
            setComment('')

            // Gọi lại hàm callback để reload review
            onSubmitSuccess()
        } catch (error) {
            Swal.fire('Lỗi', handleErrorResponse(error), 'error')
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
