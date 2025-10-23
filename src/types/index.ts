export interface Product {
    id: string;
    name: string;
    image_url: string;
    purchase_price: number;
    sale_price: number;
    stock: number;
    created_at: string;
}

export interface Sale {
    id: string;
    product_id: string;
    product_name: string;
    quantity: number;
    sale_price: number;
    total: number;
    created_at: string;
}

export interface User {
    id: string;
    email: string;
}