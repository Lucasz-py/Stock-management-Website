import { useState, useEffect } from 'react';
import { type Product } from '../../types';
import { uploadProductImage } from '../../lib/supabase';

interface ProductFormProps {
    onSubmit: (product: Omit<Product, 'id' | 'created_at'>) => Promise<void>;
    onCancel: () => void;
    editProduct?: Product | null;
}

export default function ProductForm({ onSubmit, onCancel, editProduct }: ProductFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        image_url: '',
        purchase_price: 0,
        sale_price: 0,
        stock: 0,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Nuevo estado para el error del formulario
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (editProduct) {
            setFormData({
                name: editProduct.name,
                image_url: editProduct.image_url,
                purchase_price: editProduct.purchase_price,
                sale_price: editProduct.sale_price,
                stock: editProduct.stock,
            });
            setImagePreview(editProduct.image_url);
            setImageFile(null);
        } else {
            // Resetear formulario para "Nuevo Producto"
            setFormData({
                name: '',
                image_url: '',
                purchase_price: 0,
                sale_price: 0,
                stock: 0,
            });
            setImageFile(null);
            setImagePreview('');
        }

        // Limpiar error y estado 'submitting' al cambiar de modo
        setFormError(null);
        setIsSubmitting(false);

    }, [editProduct]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Generar vista previa local
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        setFormError(null); // Limpiar error anterior

        try {
            let imageUrl = formData.image_url;

            // 1. Si hay un archivo nuevo, subirlo primero
            if (imageFile) {
                imageUrl = await uploadProductImage(imageFile);
            }

            // 2. Llamar a la lógica de guardado (addProduct/updateProduct)
            // Si esto falla, el 'throw' en ProductList hará que salte al catch
            await onSubmit({
                ...formData,
                image_url: imageUrl,
            });

            // Si onSubmit tiene éxito, ProductList cerrará el modal.
            // No necesitamos poner setIsSubmitting(false) aquí.

        } catch (error) {
            console.error('Error en el formulario:', error);

            // 3. Mostrar el error al usuario dentro del modal
            let errorMessage = "Ocurrió un error desconocido.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            // Puedes personalizar mensajes comunes de Supabase aquí si quieres
            // ej: if (errorMessage.includes("RLS")) { ... }

            setFormError(`❌ Error al guardar: ${errorMessage}`);

            // 4. ¡Importante! Reactivar el botón para que pueda reintentar
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        {editProduct ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre del Producto
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                disabled={isSubmitting}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
                                placeholder="Ej: Laptop HP"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Imagen del Producto
                            </label>

                            {imagePreview && (
                                <div className="mb-3">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
                                    />
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={isSubmitting}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Selecciona una imagen desde tu computadora (JPG, PNG, etc.)
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Precio Compra
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.purchase_price}
                                    onChange={(e) => setFormData({ ...formData, purchase_price: parseFloat(e.target.value) || 0 })}
                                    required
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Precio Venta
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.sale_price}
                                    onChange={(e) => setFormData({ ...formData, sale_price: parseFloat(e.target.value) || 0 })}
                                    required
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {!editProduct && (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800">
                                    ℹ️ El stock inicial será 0. Podrás ajustarlo desde la sección de Stock.
                                </p>
                            </div>
                        )}

                        {/* --- Bloque para mostrar el error --- */}
                        {formError && (
                            <div className="p-3 bg-red-50 border border-red-300 rounded-lg">
                                <p className="text-sm text-red-800 font-medium">{formError}</p>
                            </div>
                        )}
                        {/* --- Fin del bloque de error --- */}


                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Guardando...' : (editProduct ? 'Actualizar' : 'Crear Producto')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}