import { type Product } from '../../types';

interface ProductCardProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">
            <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
                    }}
                />
            </div>

            <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>

                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Precio Compra:</span>
                        <span className="font-semibold text-blue-600">${product.purchase_price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Precio Venta:</span>
                        <span className="font-semibold text-green-600">${product.sale_price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Stock:</span>
                        <span className={`font-semibold ${product.stock < 10 ? 'text-red-600' : 'text-gray-800'}`}>
                            {product.stock} unidades
                        </span>
                    </div>
                </div>

                <div className="flex space-x-2">
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