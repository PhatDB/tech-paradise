export interface CartItem {
    productId: number;
    productName: string;
    price: number;
    discountPrice: number;
    quantity: number;
    imageUrl: string;
}

export interface Cart {
    cartId: number;
    customerId: number;
    cartItems: CartItem[];
    totalPrice: number;
}