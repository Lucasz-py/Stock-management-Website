import { useState, useEffect } from 'react';
import { type Product, type ProductVariant } from '../../types';
import { getVariantsByProductId } from '../../lib/supabase';
import { X, ShoppingCart, Search } from 'lucide-react';

interface VariantSelectorProps {
    product: Product;
    onClose: () => void;
    onSelectVariant: (variant: ProductVariant) => void;
}

export default function VariantSelector({ product, onClose, onSelectVariant }: VariantSelectorProps) {
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    // Nuevo estado para manejar error de imagen
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        loadVariants();
        setImageError(false);
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
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

    const filteredVariants = variants.filter(variant => 
        variant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        // Contenedor principal con fondo borroso
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            
            {/* Modal de DOS COLUMNAS con altura fija */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex overflow-hidden relative">
                
                {/* Botón Cerrar Flotante */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-black/10 text-gray-500 dark:text-gray-400 rounded-full transition"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* --- COLUMNA IZQUIERDA: IMAGEN (Igual que en Stock) --- */}
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
                        <p className="text-sm opacity-90 mt-1">Selecciona una opción para vender</p>
                    </div>
                </div>

                {/* --- COLUMNA DERECHA: CONTENIDO --- */}
                <div className="flex-1 flex flex-col h-full w-full md:w-2/3 bg-white dark:bg-gray-900">
                    
                    {/* 1. Header Fijo (Estilo Stock) */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                {/* Usamos ShoppingCart aquí para diferenciarlo un poco */}
                                <ShoppingCart className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Seleccionar Variante</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 md:hidden">{product.name}</p>
                            </div>
                        </div>

                        {/* Buscador integrado */}
                        {variants.length > 0 && (
                            <div className="mt-4 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar Variante..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-800 dark:text-white transition"
                                />
                            </div>
                        )}
                    </div>

                    {/* 2. Lista Scrollable (Estilo Stock) */}
                    <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-3 custom-scrollbar">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
                                Cargando variantes...
                            </div>
                        ) : variants.length === 0 ? (
                            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-6 text-center">
                                <p className="text-gray-600 dark:text-gray-300">Este producto no tiene variantes configuradas.</p>
                            </div>
                        ) : filteredVariants.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                No se encontraron variantes con "{searchTerm}"
                            </div>
                        ) : (
                            // LISTA DE BOTONES (Con estilo de fila de Stock)
                            filteredVariants.map(variant => (
                                <button
                                    key={variant.id}
                                    onClick={() => variant.stock > 0 && onSelectVariant(variant)}
                                    disabled={variant.stock === 0}
                                    // Clase base similar a StockItem row
                                    className={`relative group flex items-center justify-between w-full p-4 bg-white dark:bg-gray-800 border rounded-xl text-left transition-all shadow-sm
                                        ${variant.stock > 0 
                                            ? 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 cursor-pointer hover:shadow-md' 
                                            : 'border-gray-100 dark:border-gray-800 opacity-60 cursor-not-allowed'
                                        }`}
                                >
                                    {/* Línea de Color Vertical (Estilo redondeado de Stock) */}
                                    <div 
                                        className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full" 
                                        style={{ backgroundColor: variant.color || '#ccc' }} 
                                    />

                                    {/* Contenido principal */}
                                    <div className="pl-5 flex-1 min-w-0 pr-4">
                                        <h4 className={`font-bold text-lg truncate ${variant.stock > 0 ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
                                            {variant.name}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Stock disponible:</p>
                                            <span className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${variant.stock > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                {variant.stock}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Icono de Carrito al Hover (Solo si hay stock) */}
                                    {variant.stock > 0 && (
                                        <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110 group-hover:translate-x-1">
                                            <ShoppingCart className="w-5 h-5" />
                                        </div>
                                    )}
                                </button>
                            ))
                        )}
                    </div>

                    {/* 3. Footer Fijo (Estilo Stock) */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end bg-gray-50/50 dark:bg-gray-900 flex-shrink-0">
                        <button
                            onClick={onClose}
                            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}