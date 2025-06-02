'use client';

import Image from 'next/image';
import {CartItem} from '@/types/cart';
import QuantitySelector from '@/components/product/QuantitySelector';
import {formatCurrency} from '@/lib/format';
import axiosClient from '@/lib/axiosClient';
import {useState} from 'react';

interface Props {
    cartId: number;
    item: CartItem;
    customerId?: number | null;
    sessionId?: string;
    onQuantityUpdated?: () => void;
}

export default function CartItemRow({
                                        cartId,
                                        item,
                                        customerId,
                                        sessionId,
                                        onQuantityUpdated,
                                    }: Props) {
    const [loading, setLoading] = useState(false);
    const image = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${item.imageUrl}`;

    const handleQuantityChange = async (newQuantity: number) => {
        setLoading(true);
        try {
            await axiosClient.post('/api/v1/cart/add-to-cart', {
                customerId,
                sessionId,
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

    const handleRemoveClick = async () => {
        setLoading(true);
        try {
            await axiosClient.post('/api/v1/cart/remove-item', {
                cartId,
                productId: item.productId,
                customerId,
                sessionId,
            });
            onQuantityUpdated?.();
        } catch (error) {
            console.error('Xóa sản phẩm thất bại:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <tr className="border-t text-sm text-gray-800">
            <td className="p-3 text-center">
                <Image
                    src={image}
                    alt={item.productName}
                    width={60}
                    height={60}
                    className="object-contain rounded"
                />
            </td>

            <td className="p-3 font-medium">{item.productName}</td>

            <td className="p-3 text-right text-red-600 font-semibold">
                {formatCurrency(item.discountPrice)}
            </td>

            <td className="p-3 text-center">
                <QuantitySelector value={item.quantity} onChange={handleQuantityChange}/>
            </td>

            <td className="p-3 text-right font-medium">
                {formatCurrency(item.quantity * item.discountPrice)}
            </td>

            <td className="p-3 text-center">
                <button
                    onClick={handleRemoveClick}
                    className="text-red-500 hover:underline hover:text-red-700 transition text-sm"
                    disabled={loading}
                >
                    Xóa
                </button>
            </td>
        </tr>
    );
}
