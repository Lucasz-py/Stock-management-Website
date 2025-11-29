import { memo } from 'react';
import { type Product } from '../../types';
import OptimizedImage from '../Common/OptimizedImage';
import { Trash2, Edit } from 'lucide-react'; // IMPORTADO: Iconos para reemplazar texto

interface ProductCardProps {
    product: Product;
    onEdit: (product: Product) => void;
    onManageVariants: (product: Product) => void; 
    onDelete: (id: string) => void;
}

function ProductCard({ product, onEdit, onManageVariants, onDelete }: ProductCardProps) {
    const displayStock = product.stock; 
    const displayPurchasePrice = product.purchase_price;
    const displaySalePrice = product.sale_price;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                <OptimizedImage
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full"
                />
            </div>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">
                    {product.name}
                </h3>

                <div className="space-y-2 mb-4 flex-1">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Precio Compra:</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">${displayPurchasePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Precio Venta:</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">${displaySalePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Stock:</span>
                        <span className={`font-semibold ${displayStock < 5 ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-white'}`}>
                            {displayStock} unidades (Total)
                        </span>
                    </div>
                </div>

                <div className="flex space-x-2 mt-auto pt-2">
                    {/* BOTÓN PRINCIPAL: GESTIONAR VARIANTE */}
                    <button
                        onClick={() => onManageVariants(product)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition text-sm font-medium"
                    >
                        Gestionar Variantes
                    </button>
                    
                    {/* BOTÓN DE ELIMINAR (Icono) */}
                    <button
                        onClick={() => onDelete(product.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition flex items-center justify-center"
                        title="Eliminar Producto"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>

                    {/* BOTÓN DE EDITAR PROPIEDADES BASE (Icono) */}
                    <button
                        onClick={() => onEdit(product)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition flex items-center justify-center"
                        title="Editar Producto Base"
                    >
                        <Edit className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// Memoización sin cambios
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