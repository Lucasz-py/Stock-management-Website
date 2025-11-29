// Archivo: src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js';
// Importamos los tipos necesarios
import { type ProductVariant } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- FUNCIONES DE STORAGE (EXISTENTES) ---

const STORAGE_BUCKET = 'product-images'; 

export const uploadProductImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
            cacheControl: '3600', 
            upsert: false,
        });

    if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw uploadError;
    }

    const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

    if (!data) {
        throw new Error('No se pudo obtener la URL pública de la imagen.');
    }

    return data.publicUrl;
};

const getPathFromUrl = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        const parts = urlObj.pathname.split('/');
        const bucketIndex = parts.indexOf(STORAGE_BUCKET);
        if (bucketIndex === -1 || bucketIndex === parts.length - 1) {
            return null; 
        }
        return parts.slice(bucketIndex + 1).join('/');
    } catch (e) {
        console.error('Error parsing URL:', e);
        return null;
    }
};

export const deleteProductImage = async (imageUrl: string) => {
    if (imageUrl.startsWith('data:image')) {
        console.log('Omitiendo eliminación de imagen Base64.');
        return;
    }

    const filePath = getPathFromUrl(imageUrl);

    if (!filePath) {
        console.error('No se pudo extraer el path del archivo desde la URL:', imageUrl);
        return;
    }

    const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([filePath]);

    if (error) {
        console.error('Error eliminando imagen del storage:', error);
    } else {
        console.log('Imagen antigua eliminada del storage:', filePath);
    }
};

// --- FUNCIONES DE PRODUCTOS (BASE) ---

export const getProducts = async () => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// Ahora addProduct acepta un objeto parcial (para permitir inicializar stock/precio en 0)
// o el objeto completo si decides enviarlo.
export const addProduct = async (product: {
    name: string;
    image_url: string;
    purchase_price?: number; // Opcional o 0 por defecto
    sale_price?: number;     // Opcional o 0 por defecto
    stock?: number;          // Opcional o 0 por defecto
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

// --- NUEVAS FUNCIONES PARA VARIANTES (AROMAS) ---

// 1. Obtener variantes de un producto específico
export const getVariantsByProductId = async (productId: string) => {
    const { data, error } = await supabase
        .from('product_variants') // Asegúrate de haber creado esta tabla en Supabase
        .select('*')
        .eq('product_id', productId)
        .order('name'); // Ordenar alfabéticamente por nombre de aroma
    
    if (error) throw error;
    return data as ProductVariant[];
};

// 2. Agregar una nueva variante
export const addVariant = async (variant: Omit<ProductVariant, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
        .from('product_variants')
        .insert([variant])
        .select()
        .single(); // Esperamos un solo objeto de respuesta
    
    if (error) throw error;
    return data;
};

// 3. Actualizar una variante existente
export const updateVariant = async (id: string, updates: Partial<ProductVariant>) => {
    const { data, error } = await supabase
        .from('product_variants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// 4. Eliminar una variante
export const deleteVariant = async (id: string) => {
    const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// 5. FUNCIÓN DE AYUDA: Calcular y actualizar el stock total del producto padre
// Esta función sirve para mantener la tarjeta principal actualizada con la suma de las variantes
export const updateParentProductStock = async (productId: string) => {
    // A. Obtener todas las variantes de este producto
    const { data: variants } = await supabase
        .from('product_variants')
        .select('stock')
        .eq('product_id', productId);

    if (!variants) return;

    // B. Sumar el stock de todas las variantes
    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

    // C. Actualizar el campo 'stock' del producto padre
    await supabase
        .from('products')
        .update({ stock: totalStock })
        .eq('id', productId);
};


// --- FUNCIONES DE VENTAS (EXISTENTES) ---

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