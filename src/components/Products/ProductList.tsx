import { useState, useEffect } from 'react';
import { type Product } from '../../types';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../lib/supabase';
import ProductCard from './ProductCard';
import ProductForm from './ProductForm';
import MainLayout from '../Layout/MainLayout';

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

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
                await updateProduct(editingProduct.id, productData);
            } else {
                await addProduct(productData);
            }
            await loadProducts();
            setShowForm(false);
            setEditingProduct(null);
        } catch (error) {
            console.error('Error guardando producto:', error);
            alert('Error al guardar el producto');
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        try {
            await deleteProduct(id);
            await loadProducts();
        } catch (error) {
            console.error('Error eliminando producto:', error);
            alert('Error al eliminar el producto');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingProduct(null);
    };

    if (loading) {
        return (
            <MainLayout title="Productos">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">Cargando productos...</div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Productos">
            <div className="mb-6">
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
                >
                    + Agregar Producto
                </button>
            </div>

            {products.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No hay productos registrados
                    </h3>
                    <p className="text-gray-500">
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
                            onDelete={handleDelete}
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
        </MainLayout>
    );
}