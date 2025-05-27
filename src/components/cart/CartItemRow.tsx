'use client';

import Image from 'next/image';
import {CartItem} from '@/types/cart';
import QuantitySelector from '@/components/product/QuantitySelector';
import {formatCurrency} from '@/lib/format';
import axiosClient from '@/lib/axiosClient';
import {useState} from 'react';

interface Props {
    item: CartItem;
    onRemove?: (productId: number) => void;
    onQuantityUpdated?: () => void;
}

export default function CartItemRow({item, onRemove, onQuantityUpdated}: Props) {
    const [loading, setLoading] = useState(false);
    const image = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${item.imageUrl}`;
    const customerId = typeof window !== 'undefined' ? parseInt(localStorage.getItem('userId') || '1') : 1;

    const handleQuantityChange = async (newQuantity: number) => {
        setLoading(true);
        try {
            await axiosClient.post('/api/v1/cart/add-to-cart', {
                customerId,
                productId: item.productId,
                quantity: newQuantity,
            });
            onQuantityUpdated?.();
        } catch (error) {
            console.error('Cập nhật số lượng thất bại:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <tr className="border-t text-sm text-gray-800">
            <td className="p-3 text-center">
                <Image src={image} alt={item.productName} width={60} height={60} className="object-contain rounded"/>
            </td>

            <td className="p-3 font-medium">{item.productName}</td>

            <td className="p-3 text-right text-red-600 font-semibold">
                {formatCurrency(item.discountPrice)}
            </td>

            <td className="p-3 text-center">
                <QuantitySelector
                    value={item.quantity}
                    onChange={handleQuantityChange}
                />
            </td>

            <td className="p-3 text-right font-medium">
                {formatCurrency(item.quantity * item.discountPrice)}
            </td>

            <td className="p-3 text-center">
                <button
                    onClick={() => onRemove?.(item.productId)}
                    className="text-red-500 hover:underline hover:text-red-700 transition text-sm"
                    disabled={loading}
                >
                    Xóa
                </button>
            </td>
        </tr>
    );
}
