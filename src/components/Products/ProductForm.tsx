import { useState, useEffect } from 'react';
import { type Product } from '../../types';
import { uploadProductImage } from '../../lib/supabase';

interface ProductFormProps {
    onSubmit: (product: Omit<Product, 'id' | 'created_at' | 'stock'>) => Promise<void>; 
    onCancel: () => void;
    editProduct?: Product | null;
}

export default function ProductForm({ onSubmit, onCancel, editProduct }: ProductFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        image_url: '',
        purchase_price: '', 
        sale_price: '',     
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (editProduct) {
            setFormData({
                name: editProduct.name,
                image_url: editProduct.image_url,
                purchase_price: editProduct.purchase_price.toString(),
                sale_price: editProduct.sale_price.toString(),
            });
            setImagePreview(editProduct.image_url);
            setImageFile(null);
        } else {
            setFormData({
                name: '',
                image_url: '',
                purchase_price: '',
                sale_price: '',
            });
            setImageFile(null);
            setImagePreview('');
        }
        setFormError(null);
        setIsSubmitting(false);
    }, [editProduct]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
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
        setFormError(null); 

        try {
            let imageUrl = formData.image_url;

            if (imageFile) {
                imageUrl = await uploadProductImage(imageFile);
            }

            await onSubmit({
                name: formData.name, 
                image_url: imageUrl,
                purchase_price: parseFloat(formData.purchase_price) || 0,
                sale_price: parseFloat(formData.sale_price) || 0,
            });

        } catch (error) {
            console.error('Error en el formulario:', error);
            let errorMessage = "Ocurrió un error desconocido.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            setFormError(`❌ Error al guardar: ${errorMessage}`);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                        {editProduct ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                Nombre del Producto
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                disabled={isSubmitting}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Ej: Sahumerio Slim Tibetano"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                Imagen del Producto
                            </label>
                            {imagePreview && (
                                <div className="mb-3">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={isSubmitting}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:file:bg-blue-900 dark:file:text-blue-300 dark:hover:file:bg-blue-800"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                    Precio Compra
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.purchase_price}
                                    onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                                    required
                                    disabled={isSubmitting}
                                    // CAMBIO: Se agregaron clases para ocultar flechas (spinners)
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                    Precio Venta
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.sale_price}
                                    onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                                    required
                                    disabled={isSubmitting}
                                    // CAMBIO: Se agregaron clases para ocultar flechas (spinners)
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* CAMBIO: Se eliminó el mensaje informativo azul que estaba aquí */}

                        {formError && (
                            <div className="p-3 bg-red-50 border border-red-300 rounded-lg dark:bg-red-900 dark:border-red-700">
                                <p className="text-sm text-red-800 dark:text-red-200 font-medium">{formError}</p>
                            </div>
                        )}

                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
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