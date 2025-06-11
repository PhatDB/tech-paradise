export interface Order {
    orderId: number;
    totalAmount: number;
    status: number;
    createdAt: string;
    orderItems: OrderItem[];
}

export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}

