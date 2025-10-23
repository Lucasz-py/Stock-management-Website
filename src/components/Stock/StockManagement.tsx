import { useState, useEffect } from 'react';
import { type Product } from '../../types';
import { getProducts, updateProduct } from '../../lib/supabase';
import StockItem from './StockItem';
import MainLayout from '../Layout/MainLayout';

export default function StockManagement() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleUpdateStock = async (id: string, newStock: number) => {
        try {
            await updateProduct(id, { stock: newStock });
            await loadProducts();
        } catch (error) {
            console.error('Error actualizando stock:', error);
            alert('Error al actualizar el stock');
        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const lowStockCount = products.filter((p) => p.stock < 10).length;
    const outOfStockCount = products.filter((p) => p.stock === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.stock * p.purchase_price), 0);

    if (loading) {
        return (
            <MainLayout title="Gestión de Stock">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">Cargando stock...</div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Gestión de Stock">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Productos Totales</p>
                            <p className="text-3xl font-bold text-gray-800">{products.length}</p>
                        </div>
                        <div className="text-5xl">📦</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Stock Bajo</p>
                            <p className="text-3xl font-bold text-yellow-600">{lowStockCount}</p>
                        </div>
                        <div className="text-5xl">⚠️</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Sin Stock</p>
                            <p className="text-3xl font-bold text-red-600">{outOfStockCount}</p>
                        </div>
                        <div className="text-5xl">🚫</div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Valor Total del Inventario</h2>
                    <p className="text-3xl font-bold text-green-600">${totalValue.toFixed(2)}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar producto..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No se encontraron productos
                        </h3>
                        <p className="text-gray-500">
                            Intenta con otro término de búsqueda
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProducts.map((product) => (
                                    <StockItem
                                        key={product.id}
                                        product={product}
                                        onUpdateStock={handleUpdateStock}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}