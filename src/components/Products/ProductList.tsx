import { useState, useEffect, useCallback } from 'react';
import { type Product } from '../../types';
import {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteProductImage
} from '../../lib/supabase';
import ProductCard from './ProductCard';
import ProductForm from './ProductForm';
import MainLayout from '../Layout/MainLayout';

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data || []);
        } catch (error) {
            console.error('Error cargando productos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (productData: Omit<Product, 'id' | 'created_at'>) => {
        try {
            if (editingProduct) {
                // Si la URL de la imagen cambió, elimina la antigua del storage
                if (productData.image_url !== editingProduct.image_url) {
                    deleteProductImage(editingProduct.image_url).catch(err => {
                        console.error("Fallo al eliminar imagen antigua:", err);
                    });
                }

                await updateProduct(editingProduct.id, productData);
                setSuccessMessage('✅ Producto actualizado exitosamente');
            } else {
                await addProduct(productData);
                setSuccessMessage('✅ Producto creado exitosamente');
            }

            await loadProducts();
            setShowForm(false);
            setEditingProduct(null);

            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error guardando producto:', error);

            // 1. Muestra el mensaje de error en el fondo
            setSuccessMessage('❌ Error al guardar el producto');
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

            // 2. ¡Importante! Relanza el error para que el formulario lo atrape
            throw error;
        }
    };

    // Optimizamos las funciones con useCallback
    const handleEdit = useCallback((product: Product) => {
        setEditingProduct(product);
        setShowForm(true);
    }, []); // Array vacío = la función nunca cambia

    const handleDeleteClick = useCallback((id: string) => {
        setProductToDelete(id);
        setShowDeleteConfirm(true);
    }, []); // Array vacío = la función nunca cambia

    const confirmDelete = async () => {
        if (!productToDelete) return;

        try {
            // Buscamos el producto en el estado actual para obtener su URL
            const product = products.find(p => p.id === productToDelete);

            // 1. Eliminar el producto de la base de datos
            await deleteProduct(productToDelete);

            // 2. Si se eliminó bien y tenía imagen, borrarla del storage
            if (product && product.image_url) {
                // Llamamos sin 'await' para no bloquear la UI
                deleteProductImage(product.image_url).catch(err => {
                    console.error("Fallo al eliminar imagen:", err);
                });
            }

            setSuccessMessage('✅ Producto eliminado exitosamente');
            await loadProducts(); // Recargamos la lista

            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error eliminando producto:', error);
            setSuccessMessage('❌ Error al eliminar el producto');
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } finally {
            setShowDeleteConfirm(false);
            setProductToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setProductToDelete(null);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingProduct(null);
    };

    if (loading) {
        return (
            <MainLayout title="Productos">
                <div className="flex items-center justify-center h-64">
                    {/* CAMBIO: Texto de carga oscuro */}
                    <div className="text-gray-500 dark:text-gray-400">Cargando productos...</div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Productos">
            {/* Mensaje de éxito/error */}
            {successMessage && (
                // CAMBIO: Estilos dark: para el mensaje
                <div className={`mb-6 p-4 rounded-lg shadow-lg animate-slide-down ${successMessage.includes('❌')
                    ? 'bg-red-50 border-2 border-red-500 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200'
                    : 'bg-green-50 border-2 border-green-500 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200'
                    }`}>
                    <p className="font-semibold text-center text-lg">{successMessage}</p>
                </div>
            )}

            <div className="mb-6">
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
                >
                    + Agregar Producto
                </button>
            </div>

            {products.length === 0 ? (
                // CAMBIO: Estilos dark: para el estado vacío
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        No hay productos registrados
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Comienza agregando tu primer producto
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onEdit={handleEdit}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>
            )}

            {showForm && (
                <ProductForm
                    onSubmit={handleAddProduct}
                    onCancel={handleCancel}
                    editProduct={editingProduct}
                />
            )}

            {/* Modal de confirmación de eliminación */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    {/* CAMBIO: Estilos dark: para el modal de borrado */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                ¿Estás seguro?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Esta acción no se puede deshacer. El producto será eliminado permanentemente.
                            </p>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={cancelDelete}
                                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                            >
                                Sí, Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}