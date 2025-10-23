import { useState, useEffect } from 'react';
import { type Sale } from '../../types';
import { getSales } from '../../lib/supabase';
import RecordItem from './RecordItem';
import MainLayout from '../Layout/MainLayout';

export default function RecordsView() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

    useEffect(() => {
        loadSales();
    }, []);

    const loadSales = async () => {
        try {
            const data = await getSales();
            setSales(data || []);
        } catch (error) {
            console.error('Error cargando ventas:', error);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredSales = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        switch (filter) {
            case 'today':
                return sales.filter((sale) => new Date(sale.created_at) >= today);
            case 'week':
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                return sales.filter((sale) => new Date(sale.created_at) >= weekAgo);
            case 'month':
                const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                return sales.filter((sale) => new Date(sale.created_at) >= monthAgo);
            default:
                return sales;
        }
    };

    const filteredSales = getFilteredSales();
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalSales = filteredSales.length;
    const totalProducts = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);

    if (loading) {
        return (
            <MainLayout title="Registros de Ventas">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">Cargando registros...</div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Registros de Ventas">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Total Ventas</p>
                            <p className="text-3xl font-bold text-gray-800">{totalSales}</p>
                        </div>
                        <div className="text-5xl">📋</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Productos Vendidos</p>
                            <p className="text-3xl font-bold text-blue-600">{totalProducts}</p>
                        </div>
                        <div className="text-5xl">📦</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Ingresos Totales</p>
                            <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="text-5xl">💰</div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-gray-700 font-medium">Filtrar por:</span>
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Todas
                        </button>
                        <button
                            onClick={() => setFilter('today')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'today'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Hoy
                        </button>
                        <button
                            onClick={() => setFilter('week')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'week'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Última Semana
                        </button>
                        <button
                            onClick={() => setFilter('month')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'month'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Último Mes
                        </button>
                    </div>
                </div>

                {filteredSales.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No hay registros de ventas
                        </h3>
                        <p className="text-gray-500">
                            Las ventas realizadas aparecerán aquí
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cantidad
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Precio Unit.
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredSales.map((sale) => (
                                    <RecordItem key={sale.id} sale={sale} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}