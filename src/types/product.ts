export interface Product {
    id: number;
    productName: string;
    price: number;
    discount: number;
    isActive: boolean;
    isFeatured: boolean;
    stock: number;
    soldQuantity: number;
    specs: string;
    imageUrl: string;
    rating: number;
    productSpecs: ProductSpec[];
}

export interface ProductResponse {
    data: Product[];
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

export interface PageProps {
    products: Product[];
}

export interface ProductImage {
    imageId: number
    imageUrl: string
    isMain: boolean
    sortOrder: number
}

export interface ProductDetail {
    productId: number;
    productName: string;
    description: string;
    specs: string;
    price: number;
    discount: number;
    stock: number;
    soldQuantity: number;
    isActive: boolean;
    isFeatured: boolean;
    createdAt: string;
    productSpecs: ProductSpec[];
    images: ProductImage[];
    productReviews: ProductReview[];
}


export interface ProductSpec {
    id: number;
    productId: number;
    specName: string;
    specValue: string;
}

export interface Review {
    reviewId: number;
    rating: number;
    comment: string;
    isVerified: boolean;
    created_at: string;
}

export interface ProductReview {
    customerId: number;
    customerName: string;
    reviews: Review[];
}