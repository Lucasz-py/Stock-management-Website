import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- NUEVAS FUNCIONES DE STORAGE ---

const STORAGE_BUCKET = 'product-images'; // Asegúrate que coincida con tu bucket

/**
 * Sube un archivo de imagen al bucket 'PRODUCT-IMAGES'
 * @param file El archivo a subir
 * @returns La URL pública de la imagen subida
 */
export const uploadProductImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    // Nombre de archivo único para evitar colisiones
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
            cacheControl: '3600', // Cache por 1 hora
            upsert: false,
        });

    if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw uploadError;
    }

    // Obtener la URL pública
    const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

    if (!data) {
        throw new Error('No se pudo obtener la URL pública de la imagen.');
    }

    return data.publicUrl;
};

/**
 * Extrae el 'path' (nombre del archivo) de una URL pública de Supabase Storage
 * @param url La URL pública completa
 * @returns El path del archivo (ej: "imagen_123.png")
 */
const getPathFromUrl = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        const parts = urlObj.pathname.split('/');
        // La ruta del archivo es lo que viene después del nombre del bucket
        const bucketIndex = parts.indexOf(STORAGE_BUCKET);
        if (bucketIndex === -1 || bucketIndex === parts.length - 1) {
            return null; // No se encontró el bucket en la ruta
        }
        return parts.slice(bucketIndex + 1).join('/');
    } catch (e) {
        console.error('Error parsing URL:', e);
        return null;
    }
};

/**
 * Elimina una imagen de Supabase Storage usando su URL pública
 * @param imageUrl La URL pública completa de la imagen a eliminar
 */
export const deleteProductImage = async (imageUrl: string) => {
    // No intentes eliminar imágenes Base64 (datos antiguos)
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
        // No relanzamos el error para no bloquear la eliminación del producto
    } else {
        console.log('Imagen antigua eliminada del storage:', filePath);
    }
};

// --- FUNCIONES DE PRODUCTOS (EXISTENTES) ---

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