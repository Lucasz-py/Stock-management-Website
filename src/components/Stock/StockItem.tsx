import { useState, useEffect } from 'react';
import { type Product, type ProductVariant } from '../../types';
import { getVariantsByProductId, updateVariant, updateParentProductStock, updateProduct } from '../../lib/supabase';
import { Package, X, AlertCircle, Search } from 'lucide-react';

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
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (showModal) {
            loadVariants();
            setImageError(false);
            setErrorMessage(null);
            setSearchTerm('');
            document.body.style.overflow = 'hidden'; 
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
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
        setTimeout(() => { setErrorMessage(null); }, 3000);
    };

    const handleVariantStockUpdate = async (variant: ProductVariant, adjustment: number, operation: 'add' | 'subtract') => {
        const newStock = operation === 'add' ? variant.stock + adjustment : variant.stock - adjustment;
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
            showTemporaryError("❌ Error al actualizar stock");
        }
    };

    const handleBaseStockUpdate = async (_dummyVariant: ProductVariant, adjustment: number, operation: 'add' | 'subtract') => {
        const newStock = operation === 'add' ? product.stock + adjustment : product.stock - adjustment;
        if (newStock < 0) {
            showTemporaryError('⚠️ El stock no puede ser negativo');
            return;
        }
        try {
            await updateProduct(product.id, { stock: newStock });
            onStockUpdated(); 
            setShowModal(false); 
        } catch (error) {
            showTemporaryError("❌ Error al actualizar stock base");
        }
    };

    const getStockStatus = () => {
        if (product.stock === 0) return { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'Sin Stock' };
        if (product.stock < 5) return { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'Stock Bajo' };
        return { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'Stock OK' };
    };

    const status = getStockStatus();

    const filteredVariants = variants.filter(variant => 
        variant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>{status.label}</span>
                </td>
                <td className="px-6 py-4">
                    <span className="text-2xl font-bold text-gray-800 dark:text-white">{product.stock}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">unidades</span>
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
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex overflow-hidden relative">
                        
                        {errorMessage && (
                            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
                                <div className="bg-red-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-medium">
                                    <AlertCircle className="w-5 h-5" />
                                    {errorMessage}
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-black/10 text-gray-500 dark:text-gray-400 rounded-full transition"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="hidden md:block w-1/3 h-full relative bg-gray-100 dark:bg-gray-800">
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className={`w-full h-full object-cover transition-opacity duration-300 ${imageError ? 'opacity-50' : 'opacity-100'}`}
                                onError={() => setImageError(true)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <h3 className="text-xl font-bold drop-shadow-md">{product.name}</h3>
                                <p className="text-sm opacity-90 mt-1">Gestionando inventario</p>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col h-full w-full md:w-2/3 bg-white dark:bg-gray-900">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <Package className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Gestionar Stock</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 md:hidden">{product.name}</p>
                                    </div>
                                </div>

                                {variants.length > 0 && (
                                    <div className="mt-4 relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar aroma o variante..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-800 dark:text-white transition"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-3 custom-scrollbar">
                                {loadingVariants ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
                                        <p>Cargando stock...</p>
                                    </div>
                                ) : variants.length === 0 ? (
                                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-6 text-center">
                                        <p className="text-blue-800 dark:text-blue-300 font-medium mb-1">Producto Único</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Este producto no tiene variantes configuradas.</p>
                                        
                                        <VariantStockRow 
                                            variant={{
                                                id: product.id, 
                                                product_id: '',
                                                name: "Stock General",
                                                stock: product.stock,
                                                purchase_price: product.purchase_price,
                                                sale_price: product.sale_price
                                            }} 
                                            onUpdate={handleBaseStockUpdate} 
                                        />
                                    </div>
                                ) : filteredVariants.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        No se encontraron resultados para "{searchTerm}"
                                    </div>
                                ) : (
                                    filteredVariants.map(variant => (
                                        <VariantStockRow 
                                            key={variant.id} 
                                            variant={variant} 
                                            onUpdate={handleVariantStockUpdate} 
                                        />
                                    ))
                                )}
                            </div>

                            <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end bg-gray-50/50 dark:bg-gray-900 flex-shrink-0">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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
        <div className="relative group flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-600 transition-all shadow-sm">
            
            <div 
                className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full" 
                style={{ backgroundColor: variant.color || '#94a3b8' }} 
            />

            <div className="pl-5 flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-800 dark:text-white text-lg truncate">
                        {variant.name}
                    </h4>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Stock actual:</p>
                    <span className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${variant.stock < 5 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {variant.stock}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* BOTÓN RESTAR (ROJO SIEMPRE) */}
                <button
                    onClick={() => handleAction('subtract')}
                    disabled={!amount}
                    className="w-10 h-10 flex items-center justify-center rounded-lg transition disabled:opacity-100 disabled:cursor-not-allowed bg-red-600 text-red-600 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-400 dark:hover:bg-red-900/60"
                >
                    <span className="text-lg font-bold">−</span>
                </button>
                
                <div className="relative">
                    <input
                        type="number"
                        min="1"
                        placeholder="Cant."
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-20 h-10 px-2 text-center border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                    />
                </div>
                
                {/* BOTÓN SUMAR (VERDE SIEMPRE) */}
                <button
                    onClick={() => handleAction('add')}
                    disabled={!amount}
                    className="w-10 h-10 flex items-center justify-center rounded-lg transition disabled:opacity-100 disabled:cursor-not-allowed bg-green-600 text-green-600 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-400 dark:hover:bg-green-900/60"
                >
                    <span className="text-lg font-bold">+</span>
                </button>
            </div>
        </div>
    );
}