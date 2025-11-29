import { useState, useEffect } from 'react';
import { type Product, type ProductVariant } from '../../types';
import { getVariantsByProductId } from '../../lib/supabase';
import { Package, X, ShoppingCart } from 'lucide-react'; 

interface VariantSelectorProps {
    product: Product;
    onClose: () => void;
    onSelectVariant: (variant: ProductVariant) => void;
}

export default function VariantSelector({ product, onClose, onSelectVariant }: VariantSelectorProps) {
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadVariants();
    }, [product.id]);

    const loadVariants = async () => {
        try {
            setLoading(true);
            const data = await getVariantsByProductId(product.id);
            setVariants(data || []);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                
                <div className="p-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Package className="text-purple-600" />
                        Seleccionar Variante: <span className="text-purple-600">{product.name}</span>
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition">
                        <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Cargando...</div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {variants.map(variant => (
                                <button
                                    key={variant.id}
                                    onClick={() => variant.stock > 0 && onSelectVariant(variant)}
                                    disabled={variant.stock === 0}
                                    // Agregamos 'relative' y 'overflow-hidden' para contener la línea de color
                                    className={`relative overflow-hidden flex items-center justify-between p-4 pl-6 rounded-xl border transition-all duration-200 text-left group
                                        ${variant.stock > 0 
                                            ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-md cursor-pointer' 
                                            : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 opacity-60 cursor-not-allowed'
                                        }`}
                                >
                                    {/* CAMBIO: Línea de color vertical a la izquierda */}
                                    <div 
                                        className="absolute left-0 top-0 bottom-0 w-1.5" 
                                        style={{ backgroundColor: variant.color || '#ccc' }} 
                                    />

                                    <div>
                                        <p className={`font-bold text-lg ${variant.stock > 0 ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
                                            {variant.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Stock disponible: <span className={`font-mono font-bold ${variant.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>{variant.stock}</span>
                                        </p>
                                    </div>
                                    
                                    {variant.stock > 0 && (
                                        <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110">
                                            <ShoppingCart className="w-5 h-5" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}