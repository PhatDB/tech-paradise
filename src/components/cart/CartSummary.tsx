'use client';

import {formatCurrency} from '@/lib/format';
import {useRouter} from 'next/navigation';

export default function CartSummary({total}: { total: number }) {
    const router = useRouter();

    return (
        <div className="text-right mt-6 space-y-2">
            <div className="text-lg font-semibold text-gray-700">
                Tổng cộng: <span className="text-red-600">{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-end gap-3">
                <button
                    className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded"
                    onClick={() => router.push('/')}
                >
                    Tiếp tục mua sắm
                </button>
                <button
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded"
                    onClick={() => router.push('/checkout')}
                >
                    Thanh toán
                </button>
            </div>
        </div>
    );
}
