// lib/utils/format.ts
export const formatCurrency = (amount: number, locale = 'vi-VN', currency = 'VND') =>
    new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0
    }).format(amount);
