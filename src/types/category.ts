// Subcategory type
export interface Subcategory {
    parentId: number | null;
    categoryName: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
    subcategories: Subcategory[];
    id: number;
}

// Category type
export interface Category {
    parentId: null;
    categoryName: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
    subcategories: Subcategory[];
    id: number;
}