import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funciones helper para productos
export const getProducts = async () => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

export const addProduct = async (product: {
    name: string;
    image_url: string;
    purchase_price: number;
    sale_price: number;
    stock: number;
}) => {
    const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateProduct = async (id: string, updates: Partial<{
    name: string;
    image_url: string;
    purchase_price: number;
    sale_price: number;
    stock: number;
}>) => {
    const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteProduct = async (id: string) => {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// Funciones helper para ventas
export const getSales = async () => {
    const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

export const addSale = async (sale: {
    product_id: string;
    product_name: string;
    quantity: number;
    sale_price: number;
    total: number;
}) => {
    const { data, error } = await supabase
        .from('sales')
        .insert([sale])
        .select()
        .single();

    if (error) throw error;
    return data;
};