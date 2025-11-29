import { useState, useEffect } from 'react';
import { type Product, type ProductVariant } from '../../types';
import { getVariantsByProductId, updateVariant, updateParentProductStock } from '../../lib/supabase';
import { Package, X, AlertCircle } from 'lucide-react';

interface StockItemProps {
    product: Product;
    onStockUpdated: () => void;
}

export default function StockItem({ product, onStockUpdated }: StockItemProps) {
    const [showModal, setShowModal] = useState(false);
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [loadingVariants, setLoadingVariants] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (showModal) {
            loadVariants();
            setImageError(false);
            setErrorMessage(null);
        }
    }, [showModal]);

    const loadVariants = async () => {
        setLoadingVariants(true);
        try {
            const data = await getVariantsByProductId(product.id);
            setVariants(data || []);
        } catch (error) {
            console.error("Error cargando variantes:", error);
        } finally {
            setLoadingVariants(false);
        }
    };

    const showTemporaryError = (msg: string) => {
        setErrorMessage(msg);
        setTimeout(() => {
            setErrorMessage(null);
        }, 3000);
    };

    const handleVariantStockUpdate = async (variant: ProductVariant, adjustment: number, operation: 'add' | 'subtract') => {
        const newStock = operation === 'add' 
            ? variant.stock + adjustment 
            : variant.stock - adjustment;

        if (newStock < 0) {
            showTemporaryError('⚠️ El stock no puede ser negativo');
            return;
        }

        try {
            await updateVariant(variant.id, { stock: newStock });
            await updateParentProductStock(product.id);
            await loadVariants();
            onStockUpdated();
        } catch (error) {
            console.error("Error al actualizar stock:", error);
            showTemporaryError("❌ Error al actualizar stock");
        }
    };

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

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Sin+Imagen';
        setImageError(true);
    };

    return (
        <>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=?'; }}
                        />
                        <span className="font-medium text-gray-800 dark:text-white">{product.name}</span>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                        {status.label}
                    </span>
                </td>
                <td className="px-6 py-4">
                    <span className="text-2xl font-bold text-gray-800 dark:text-white">{product.stock}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">unidades (Total)</span>
                </td>
                <td className="px-6 py-4">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                    >
                        <Package className="w-4 h-4" /> Gestionar Stock
                    </button>
                </td>
            </tr>

            {showModal && (
                <tr>
                    <td colSpan={4}>
                        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative">
                                
                                {errorMessage && (
                                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
                                        <div className="bg-red-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-medium">
                                            <AlertCircle className="w-5 h-5" />
                                            {errorMessage}
                                        </div>
                                    </div>
                                )}

                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition z-10"
                                >
                                    <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                </button>

                                <div className="md:w-2/5 h-64 md:h-auto bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative">
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className={`w-full h-full object-cover transition-opacity duration-300 ${imageError ? 'opacity-50' : 'opacity-100'}`}
                                        onError={handleImageError}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10 pointer-events-none"></div>
                                </div>

                                <div className="flex-1 flex flex-col h-full p-6 md:p-8 overflow-hidden">
                                    <div className="mb-6 pr-8">
                                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-1">
                                            <Package className="text-purple-600" />
                                            Gestionar Stock
                                        </h3>
                                        <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                                            {product.name}
                                        </p>
                                    </div>

                                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                        {loadingVariants ? (
                                            <div className="text-center py-12 text-gray-500 flex flex-col items-center justify-center h-full">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
                                                Cargando variantes...
                                            </div>
                                        ) : variants.length === 0 ? (
                                            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center h-full">
                                                <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                                                <p className="text-gray-600 dark:text-gray-300 font-medium">
                                                    No hay variantes configuradas.
                                                </p>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    Ve a la sección "Productos" para agregar aromas o tipos primero.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3 pb-4">
                                                {variants.map(variant => (
                                                    <VariantStockRow 
                                                        key={variant.id} 
                                                        variant={variant} 
                                                        onUpdate={handleVariantStockUpdate} 
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-lg transition font-medium dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

interface VariantStockRowProps {
    variant: ProductVariant;
    onUpdate: (variant: ProductVariant, amount: number, op: 'add' | 'subtract') => void;
}

function VariantStockRow({ variant, onUpdate }: VariantStockRowProps) {
    const [amount, setAmount] = useState('');

    const handleAction = (op: 'add' | 'subtract') => {
        const val = parseInt(amount);
        if (!val || val <= 0) return;
        onUpdate(variant, val, op);
        setAmount('');
    };

    return (
        // CAMBIO: Añadido 'relative overflow-hidden pl-6' para acomodar la línea de color
        <div className="relative overflow-hidden flex items-center justify-between p-4 pl-6 bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
            
            {/* NUEVO: Línea vertical de color */}
            <div 
                className="absolute left-0 top-0 bottom-0 w-1.5" 
                style={{ backgroundColor: variant.color || '#8B5CF6' }} 
            />

            <div className="flex-1 pr-4">
                <p className="font-bold text-gray-800 dark:text-white text-lg">{variant.name}</p>
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Stock actual:</p>
                    <span className={`font-mono font-bold text-md px-2 py-0.5 rounded-md ${variant.stock < 5 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                        {variant.stock}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => handleAction('subtract')}
                    disabled={!amount}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-40 transition dark:hover:bg-red-900/20"
                    title="Restar"
                >
                    <span className="text-xl">➖</span>
                </button>
                
                <input
                    type="number"
                    min="1"
                    placeholder="Cant."
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-20 px-2 py-1 border-0 text-center focus:ring-0 font-mono text-lg bg-transparent dark:text-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                
                <button
                    onClick={() => handleAction('add')}
                    disabled={!amount}
                    className="p-2 text-green-500 hover:bg-green-50 rounded-md disabled:opacity-40 transition dark:hover:bg-green-900/20"
                    title="Sumar"
                >
                    <span className="text-xl">➕</span>
                </button>
            </div>
        </div>
    );
}