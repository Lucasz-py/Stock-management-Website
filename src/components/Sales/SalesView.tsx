import { useState, useEffect } from 'react';
import { type Product } from '../../types';
import { getProducts, addSale, updateProduct } from '../../lib/supabase';
import SaleForm from './SaleForm';
import MainLayout from '../Layout/MainLayout';

export default function SalesView() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data || []);
        } catch (error) {
            console.error('Error cargando productos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSale = async (productId: string, quantity: number) => {
        const product = products.find((p) => p.id === productId);
        if (!product) return;

        try {
            // Registrar la venta
            await addSale({
                product_id: product.id,
                product_name: product.name,
                quantity,
                sale_price: product.sale_price,
                total: product.sale_price * quantity,
            });

            // Actualizar el stock
            const newStock = product.stock - quantity;
            await updateProduct(product.id, { stock: newStock });

            // Recargar productos
            await loadProducts();
            setSelectedProduct(null);
            setSearchTerm('');

            alert(`¡Venta registrada exitosamente!\n\nProducto: ${product.name}\nCantidad: ${quantity}\nTotal: $${(product.sale_price * quantity).toFixed(2)}`);
        } catch (error) {
            console.error('Error registrando venta:', error);
            alert('Error al registrar la venta');
        }
    };

    const filteredProducts = searchTerm === ''
        ? products
        : products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

    if (loading) {
        return (
            <MainLayout title="Ventas">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">Cargando productos...</div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Ventas">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Buscar Producto
                        </h2>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setSelectedProduct(null);
                            }}
                            placeholder="Escribe el nombre del producto..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
                        />
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden max-h-[600px] overflow-y-auto">
                        {searchTerm === '' ? (
                            <div className="p-12 text-center">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    Busca un producto
                                </h3>
                                <p className="text-gray-500">
                                    Escribe el nombre del producto que deseas vender
                                </p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="text-6xl mb-4">❌</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    No se encontró el producto
                                </h3>
                                <p className="text-gray-500">
                                    Intenta con otro nombre
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {filteredProducts.map((product) => (
                                    <button
                                        key={product.id}
                                        onClick={() => setSelectedProduct(product)}
                                        className={`w-full p-4 flex items-center space-x-4 hover:bg-gray-50 transition ${selectedProduct?.id === product.id ? 'bg-blue-50' : ''
                                            }`}
                                    >
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-16 h-16 rounded-lg object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=?';
                                            }}
                                        />
                                        <div className="flex-1 text-left">
                                            <h3 className="font-semibold text-gray-800">{product.name}</h3>
                                            <p className="text-sm text-gray-600">
                                                Precio: ${product.sale_price.toFixed(2)}
                                            </p>
                                            <p className={`text-sm font-medium ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                                                Stock: {product.stock} unidades
                                            </p>
                                        </div>
                                        {selectedProduct?.id === product.id && (
                                            <div className="text-blue-600 text-2xl">✓</div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <SaleForm selectedProduct={selectedProduct} onSubmit={handleSale} />
                </div>
            </div>
        </MainLayout>
    );
}