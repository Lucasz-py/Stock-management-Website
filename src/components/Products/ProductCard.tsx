import { memo } from 'react';
import { type Product } from '../../types';
import OptimizedImage from '../Common/OptimizedImage';

interface ProductCardProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
    return (
        // CAMBIO: Fondo de la tarjeta
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col">
            {/* CAMBIO: Fondo del placeholder de imagen */}
            <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                <OptimizedImage
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full"
                />
            </div>

            <div className="p-4 flex flex-col flex-1">
                {/* CAMBIO: Color de texto del título */}
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">
                    {product.name}
                </h3>

                <div className="space-y-2 mb-4 flex-1">
                    <div className="flex justify-between text-sm">
                        {/* CAMBIO: Color de texto de la etiqueta */}
                        <span className="text-gray-600 dark:text-gray-300">Precio Compra:</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">${product.purchase_price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        {/* CAMBIO: Color de texto de la etiqueta */}
                        <span className="text-gray-600 dark:text-gray-300">Precio Venta:</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">${product.sale_price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        {/* CAMBIO: Color de texto de la etiqueta */}
                        <span className="text-gray-600 dark:text-gray-300">Stock:</span>
                        {/* CAMBIO: Color de texto del stock */}
                        <span className={`font-semibold ${product.stock < 5 ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-white'}`}>
                            {product.stock} unidades
                        </span>
                    </div>
                </div>

                <div className="flex space-x-2 mt-auto pt-2">
                    <button
                        onClick={() => onEdit(product)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => onDelete(product.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}

// Memoizar el componente para evitar re-renders innecesarios
export default memo(ProductCard, (prevProps, nextProps) => {
    return (
        prevProps.product.id === nextProps.product.id &&
        prevProps.product.name === nextProps.product.name &&
        prevProps.product.image_url === nextProps.product.image_url &&
        prevProps.product.purchase_price === nextProps.product.purchase_price &&
        prevProps.product.sale_price === nextProps.product.sale_price &&
        prevProps.product.stock === nextProps.product.stock
    );
});