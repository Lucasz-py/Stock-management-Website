import { useState } from 'react';
import { type Product } from '../../types';

interface StockItemProps {
    product: Product;
    onUpdateStock: (id: string, newStock: number) => void;
}

export default function StockItem({ product, onUpdateStock }: StockItemProps) {
    const [showModal, setShowModal] = useState(false);
    const [adjustment, setAdjustment] = useState(0);
    const [operation, setOperation] = useState<'add' | 'subtract'>('add');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newStock = operation === 'add'
            ? product.stock + adjustment
            : product.stock - adjustment;

        if (newStock < 0) {
            alert('El stock no puede ser negativo');
            return;
        }

        onUpdateStock(product.id, newStock);
        setShowModal(false);
        setAdjustment(0);
    };

    // CAMBIO: Añadidas clases dark: a las etiquetas de estado
    const getStockStatus = () => {
        if (product.stock === 0) return {
            color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            label: 'Sin Stock'
        };
        if (product.stock < 5) return {
            color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            label: 'Stock Bajo'
        };
        return {
            color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            label: 'Stock OK'
        };
    };

    const status = getStockStatus();

    return (
        <>
            {/* CAMBIO: Añadido dark:hover:bg-gray-700 */}
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=?';
                            }}
                        />
                        {/* CAMBIO: Añadido dark:text-white */}
                        <span className="font-medium text-gray-800 dark:text-white">{product.name}</span>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                        {status.label}
                    </span>
                </td>
                <td className="px-6 py-4">
                    {/* CAMBIO: Añadido dark:text-white y dark:text-gray-400 */}
                    <span className="text-2xl font-bold text-gray-800 dark:text-white">{product.stock}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">unidades</span>
                </td>
                <td className="px-6 py-4">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                    >
                        Ajustar Stock
                    </button>
                </td>
            </tr>

            {showModal && (
                // Este <tr> y <td> es para que el modal se renderice,
                // pero el "fixed" lo saca del flujo de la tabla.
                <tr>
                    <td colSpan={4}>
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            {/* CAMBIO: Fondo, texto y borde del modal */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                                    Ajustar Stock - {product.name}
                                </h3>

                                {/* CAMBIO: Fondo y texto del panel de stock actual */}
                                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Stock Actual:</p>
                                    <p className="text-3xl font-bold text-gray-800 dark:text-white">{product.stock} unidades</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        {/* CAMBIO: Texto del label */}
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                            Operación
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setOperation('add')}
                                                className={`py-3 rounded-lg font-medium transition ${operation === 'add'
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                                    }`}
                                            >
                                                ➕ Agregar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setOperation('subtract')}
                                                className={`py-3 rounded-lg font-medium transition ${operation === 'subtract'
                                                    ? 'bg-red-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                                    }`}
                                            >
                                                ➖ Restar
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        {/* CAMBIO: Texto del label */}
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                            Cantidad
                                        </label>
                                        {/* CAMBIO: Estilos del input */}
                                        <input
                                            type="number"
                                            min="1"
                                            value={adjustment}
                                            onChange={(e) => setAdjustment(parseInt(e.target.value) || 0)}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white dark:border-gray-600"
                                            placeholder="0"
                                        />
                                    </div>

                                    {/* CAMBIO: Panel de "Nuevo Stock" */}
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                                        <p className="text-sm text-gray-600 dark:text-blue-200">Nuevo stock:</p>
                                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {operation === 'add' ? product.stock + adjustment : product.stock - adjustment} unidades
                                        </p>
                                    </div>

                                    <div className="flex space-x-3">
                                        {/* CAMBIO: Botón "Cancelar" */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowModal(false);
                                                setAdjustment(0);
                                            }}
                                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Confirmar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}