// Archivo: src/types/index.ts

export interface Product {
    id: string;
    name: string;
    image_url: string;
    // Estos campos se mantienen en el producto padre como referencia, 
    // resumen o para productos simples que no usen variantes aún.
    purchase_price: number;
    sale_price: number;
    stock: number;
    created_at: string;
}

// NUEVA INTERFAZ: Define la estructura de una variante (ej: Aroma Sándalo)
export interface ProductVariant {
    id: string;
    product_id: string; // Relación con el producto padre
    name: string;       // Nombre de la variante (el aroma)
    stock: number;      // Stock específico de este aroma
    purchase_price: number;
    sale_price: number;
    created_at?: string;
}

export interface Sale {
    id: string;
    product_id: string;
    // Opcional: Podrías querer guardar el ID de la variante vendida en el futuro
    variant_id?: string; 
    product_name: string;
    quantity: number;
    sale_price: number;
    total: number;
    created_at: string;
}

export interface ProductVariant {
    id: string;
    product_id: string;
    name: string;
    stock: number;
    purchase_price: number;
    sale_price: number;
    color?: string; // NUEVO CAMPO
    created_at?: string;
}

export interface User {
    id: string;
    email: string;
}