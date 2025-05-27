// hooks/useCartCount.ts
'use client'

import {useEffect, useState} from 'react'
import axiosClient from '@/lib/axiosClient'
import {Cart} from '@/types/cart'

export default function useCartCount() {
    const [count, setCount] = useState(0)

    useEffect(() => {
        const customerId = localStorage.getItem('customerId')
        if (!customerId) return

        axiosClient.get<Cart>(`/api/v1/cart/${customerId}`)
            .then(res => {
                const totalQuantity = res.data.cartItems.reduce(
                    (acc, item) => acc + item.quantity, 0
                )
                setCount(totalQuantity)
            })
            .catch(() => setCount(0))
    }, [])

    return count
}
