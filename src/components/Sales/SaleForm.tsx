import { useState } from 'react';
import { type Product } from '../../types';

interface SaleFormProps {
    selectedProduct: Product | null;
    onSubmit: (productId: string, quantity: number) => void;
}

export default function SaleForm({ selectedProduct, onSubmit }: SaleFormProps) {
    const [quantity, setQuantity] = useState(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;

        if (quantity > selectedProduct.stock) {
            alert(`Stock insuficiente. Solo hay ${selectedProduct.stock} unidades disponibles.`);
            return;
        }

        onSubmit(selectedProduct.id, quantity);
        setQuantity(1);
    };

    if (!selectedProduct) {
        return (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Selecciona un producto
                </h3>
                <p className="text-gray-500">
                    Busca y selecciona un producto para realizar la venta
                </p>
            </div>
        );
    }

    const total = selectedProduct.sale_price * quantity;
    const profit = (selectedProduct.sale_price - selectedProduct.purchase_price) * quantity;

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Registro de Venta</h2>
                <p className="text-green-100">Complete los detalles de la venta</p>
            </div>

            <div className="p-6">
                <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <img
                        src={selectedProduct.image_url}
                        alt={selectedProduct.name}
                        className="w-24 h-24 rounded-lg object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96?text=?';
                        }}
                    />
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{selectedProduct.name}</h3>
                        <p className="text-gray-600">Precio: ${selectedProduct.sale_price.toFixed(2)}</p>
                        <p className={`font-medium ${selectedProduct.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                            Stock disponible: {selectedProduct.stock} unidades
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cantidad a vender
                        </label>
                        <input
                            type="number"
                            min="1"
                            max={selectedProduct.stock}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            required
                            className="w-full px-4 py-3 text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Máximo: {selectedProduct.stock} unidades
                        </p>
                    </div>

                    <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Precio unitario:</span>
                            <span className="text-xl font-bold text-gray-800">
                                ${selectedProduct.sale_price.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Cantidad:</span>
                            <span className="text-xl font-bold text-gray-800">{quantity}</span>
                        </div>
                        <div className="border-t-2 border-blue-200 pt-3 flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-800">Total:</span>
                            <span className="text-3xl font-bold text-green-600">
                                ${total.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Ganancia estimada:</span>
                            <span className={`font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${profit.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={selectedProduct.stock === 0}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                        {selectedProduct.stock === 0 ? 'Sin Stock Disponible' : '✓ Registrar Venta'}
                    </button>
                </form>
            </div>
        </div>
    );
}