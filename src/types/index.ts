export interface Product {
    id: string;
    name: string;
    image_url: string;
    purchase_price: number;
    sale_price: number;
    stock: number;
    created_at: string;
}

export interface ProductVariant {
    id: string;
    product_id: string;
    name: string;
    stock: number;
    purchase_price: number;
    sale_price: number;
    color?: string;
    created_at?: string;
}

export interface Sale {
    id: string;
    product_id: string;
    variant_id?: string;
    product_name: string;
    quantity: number;
    sale_price: number;
    total: number;
    // NUEVO CAMPO
    payment_method: 'cash' | 'transfer'; 
    created_at: string;
}

export interface User {
    id: string;
    email: string;
}