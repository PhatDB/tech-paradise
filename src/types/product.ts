export interface Product {
    id: number;
    productName: string;
    price: number;
    discount: number;
    isActive: boolean;
    isFeatured: boolean;
    stock: number;
    soldQuantity: number;
    imageUrl: string;
    specs: string;
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