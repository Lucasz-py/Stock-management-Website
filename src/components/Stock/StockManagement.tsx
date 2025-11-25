import { useState, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react'; // Importación de tipos
import { type Product } from '../../types';
import { getProducts, updateProduct } from '../../lib/supabase';
import { useSettings } from '../../contexts/SettingsContext';
import StockItem from './StockItem';
import MainLayout from '../Layout/MainLayout';
import PageHeader from '../Layout/PageHeader'; // Importado

// NUEVO: Interface para las props
interface StockManagementProps {
    setShowSettingsMenu: Dispatch<SetStateAction<boolean>>;
}

// CAMBIO: Recibe la prop
export default function StockManagement({ setShowSettingsMenu }: StockManagementProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'none'>('all');

    const { showInventoryValue, showProfitValue } = useSettings();

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

    const filteredProducts = products
        .filter((product) => // 1. Filtro por búsqueda de texto
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((product) => { // 2. Filtro por estado de stock
            if (stockFilter === 'low') {
                // Stock bajo (entre 1 y 4)
                return product.stock > 0 && product.stock < 5;
            }
            if (stockFilter === 'none') {
                // Sin stock
                return product.stock === 0;
            }
            // 'all' (default)
            return true;
        });

    const lowStockCount = products.filter((p) => p.stock > 0 && p.stock < 5).length;
    const outOfStockCount = products.filter((p) => p.stock === 0).length;

    const totalPurchaseValue = products.reduce((sum, p) => sum + (p.stock * p.purchase_price), 0);
    const totalSaleValue = products.reduce((sum, p) => sum + (p.stock * p.sale_price), 0);
    const totalProfit = totalSaleValue - totalPurchaseValue;


    if (loading) {
        return (
            // CORREGIDO: Se elimina title="Gestión de Stock"
            <MainLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500 dark:text-gray-400">Cargando stock...</div>
                </div>
            </MainLayout>
        );
    }

    return (
        // CORREGIDO: Se elimina title="Gestión de Stock"
        <MainLayout>
            {/* NUEVO: Page Header con el botón de Configuración */}
            <PageHeader
                title="Gestión de Stock"
                showSettingsMenu={false}
                setShowSettingsMenu={setShowSettingsMenu}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Productos Totales</p>
                            <p className="text-3xl font-bold text-gray-800 dark:text-white">{products.length}</p>
                        </div>
                        <div className="text-5xl">📦</div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Stock Bajo</p>
                            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{lowStockCount}</p>
                        </div>
                        <div className="text-5xl">⚠️</div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Sin Stock</p>
                            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{outOfStockCount}</p>
                        </div>
                        <div className="text-5xl">🚫</div>
                    </div>
                </div>
            </div>

            {/* Valor Total del Inventario (Compra) - Condicional */}
            {showInventoryValue && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 transition-colors">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Valor de Compra (Costo del Inventario)</h2>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            ${totalPurchaseValue.toFixed(2)}
                        </p>
                    </div>
                </div>
            )}

            {/* Reporte de Ganancias (Potencial) - Condicional */}
            {showProfitValue && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 transition-colors">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        Reporte de Ganancias (Potenciales)
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-gray-600 dark:text-gray-300">Valor de Venta Total:</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                ${totalSaleValue.toFixed(2)}
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-gray-600 dark:text-gray-300">Valor de Compra Total:</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                ${totalPurchaseValue.toFixed(2)}
                            </p>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                        <div className="flex items-center justify-between">
                            <p className="text-lg font-semibold text-gray-800 dark:text-white">Ganancia Potencial Total:</p>
                            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                ${totalProfit.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    {/* Buscador */}
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar producto..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />

                    {/* NUEVO: Botones de filtro */}
                    <div className="flex flex-wrap items-center gap-3 mt-4">
                        <span className="text-gray-700 dark:text-gray-200 font-medium">Filtrar por:</span>
                        <button
                            onClick={() => setStockFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition text-sm ${stockFilter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setStockFilter('low')}
                            className={`px-4 py-2 rounded-lg font-medium transition text-sm ${stockFilter === 'low'
                                ? 'bg-yellow-500 text-white' // Color temático
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            Stock Bajo
                        </button>
                        <button
                            onClick={() => setStockFilter('none')}
                            className={`px-4 py-2 rounded-lg font-medium transition text-sm ${stockFilter === 'none'
                                ? 'bg-red-500 text-white' // Color temático
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            Sin Stock
                        </button>
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No se encontraron productos
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Ajusta los filtros o el término de búsqueda
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
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