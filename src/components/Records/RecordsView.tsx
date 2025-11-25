import { useState, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { type Sale } from '../../types';
import { getSales } from '../../lib/supabase';
import RecordItem from './RecordItem';
import MainLayout from '../Layout/MainLayout';
import { useSettings } from '../../contexts/SettingsContext';
import PageHeader from '../Layout/PageHeader'; // IMPORTADO

// NUEVO: Interface para las props
interface RecordsViewProps {
    setShowSettingsMenu: Dispatch<SetStateAction<boolean>>;
}

// CAMBIO: Recibe la prop
export default function RecordsView({ setShowSettingsMenu }: RecordsViewProps) {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

    const { showTotalRevenue } = useSettings();

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

    // FUNCIÓN CORREGIDA: Se asegura de que los filtros de tiempo comparen correctamente.
    const getFilteredSales = () => {
        const now = new Date();
        // Aseguramos que la comparación sea con la fecha de inicio del día
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        switch (filter) {
            case 'today':
                // Se utiliza getTime() para comparación numérica
                return sales.filter((sale) => new Date(sale.created_at).getTime() >= today.getTime());
            case 'week':
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                return sales.filter((sale) => new Date(sale.created_at).getTime() >= weekAgo.getTime());
            case 'month':
                const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                return sales.filter((sale) => new Date(sale.created_at).getTime() >= monthAgo.getTime());
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
            // CORREGIDO: Se elimina title=""
            <MainLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500 dark:text-gray-400">Cargando registros...</div>
                </div>
            </MainLayout>
        );
    }

    return (
        // CORREGIDO: Se elimina title=""
        <MainLayout>
            {/* NUEVO: Page Header con el botón de Configuración */}
            <PageHeader
                title="Registros de Ventas"
                showSettingsMenu={false}
                setShowSettingsMenu={setShowSettingsMenu}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Card 1: Total Ventas */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Total Ventas</p>
                            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{totalSales}</p>
                        </div>
                        <div className="text-5xl">📋</div>
                    </div>
                </div>

                {/* Card 2: Productos Vendidos */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Productos Vendidos</p>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalProducts}</p>
                        </div>
                        <div className="text-5xl">📦</div>
                    </div>
                </div>

                {/* Card 3: Ingresos Totales */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Ingresos Totales</p>
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                {showTotalRevenue ? `$${totalRevenue.toFixed(2)}` : '$***'}
                            </p>
                        </div>
                        <div className="text-5xl">💰</div>
                    </div>
                </div>
            </div>

            {/* Contenedor principal de la tabla y filtros */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-gray-700 dark:text-gray-200 font-medium">Filtrar por:</span>
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            Todas
                        </button>
                        <button
                            onClick={() => setFilter('today')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'today'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            Hoy
                        </button>
                        <button
                            onClick={() => setFilter('week')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'week'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            Última Semana
                        </button>
                        <button
                            onClick={() => setFilter('month')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'month'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            Último Mes
                        </button>
                    </div>
                </div>

                {/* Estado vacío */}
                {filteredSales.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                            No hay registros de ventas
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Las ventas realizadas aparecerán aquí
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Cantidad
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Precio Unit.
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
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