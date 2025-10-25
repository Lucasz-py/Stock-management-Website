import { useState, useEffect } from 'react';
import { type Product } from '../../types';
import { getProducts, addSale, updateProduct } from '../../lib/supabase';
import MainLayout from '../Layout/MainLayout';

interface CartItem {
    product: Product;
    quantity: number;
}

export default function SalesView() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');

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

    const addToCart = (product: Product) => {
        if (product.stock === 0) {
            setSuccessMessage('⚠️ Este producto no tiene stock disponible');
            setTimeout(() => setSuccessMessage(''), 3000);
            return;
        }

        const existingItem = cart.find(item => item.product.id === product.id);

        if (existingItem) {
            if (existingItem.quantity >= product.stock) {
                setSuccessMessage('⚠️ No hay suficiente stock disponible');
                setTimeout(() => setSuccessMessage(''), 3000);
                return;
            }
            setCart(cart.map(item =>
                item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId: string) => {
        setCart(cart.filter(item => item.product.id !== productId));
    };

    const updateCartQuantity = (productId: string, quantity: number) => {
        const item = cart.find(item => item.product.id === productId);
        if (item && quantity > item.product.stock) {
            setSuccessMessage('⚠️ No hay suficiente stock disponible');
            setTimeout(() => setSuccessMessage(''), 3000);
            return;
        }

        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCart(cart.map(item =>
            item.product.id === productId
                ? { ...item, quantity }
                : item
        ));
    };

    const handleCompleteSale = async () => {
        if (cart.length === 0) {
            setSuccessMessage('⚠️ El carrito está vacío');
            setTimeout(() => setSuccessMessage(''), 3000);
            return;
        }

        try {
            // Registrar cada venta
            for (const item of cart) {
                await addSale({
                    product_id: item.product.id,
                    product_name: item.product.name,
                    quantity: item.quantity,
                    sale_price: item.product.sale_price,
                    total: item.product.sale_price * item.quantity,
                });

                // Actualizar el stock
                const newStock = item.product.stock - item.quantity;
                await updateProduct(item.product.id, { stock: newStock });
            }

            // Recargar productos
            await loadProducts();

            const total = cart.reduce((sum, item) => sum + (item.product.sale_price * item.quantity), 0);
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

            // Mostrar mensaje de éxito
            setSuccessMessage(`✅ ¡Venta registrada exitosamente! ${totalItems} producto(s) - Total: $${total.toFixed(2)}`);

            // Limpiar el carrito
            setCart([]);
            setSearchTerm('');

            // Ocultar mensaje después de 5 segundos
            setTimeout(() => {
                setSuccessMessage('');
            }, 5000);
        } catch (error) {
            console.error('Error registrando venta:', error);
            setSuccessMessage('❌ Error al registrar la venta');
            setTimeout(() => {
                setSuccessMessage('');
            }, 5000);
        }
    };

    const filteredProducts = searchTerm === ''
        ? products
        : products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const cartTotal = cart.reduce((sum, item) => sum + (item.product.sale_price * item.quantity), 0);
    const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
            {/* Mensaje de éxito/error */}
            {successMessage && (
                <div className={`mb-6 p-4 rounded-lg shadow-lg animate-slide-down ${successMessage.includes('❌') || successMessage.includes('⚠️')
                    ? 'bg-red-50 border-2 border-red-500 text-red-800'
                    : 'bg-green-50 border-2 border-green-500 text-green-800'
                    }`}>
                    <p className="font-semibold text-center text-lg">{successMessage}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lista de Productos */}
                <div>
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Buscar o Seleccionar Producto
                        </h2>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Escribe el nombre del producto..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
                        />
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden max-h-[600px] overflow-y-auto">
                        {products.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="text-6xl mb-4">📦</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    No hay productos disponibles
                                </h3>
                                <p className="text-gray-500">
                                    Agrega productos desde la sección de Productos
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
                            <div>
                                {searchTerm === '' && (
                                    <div className="p-4 bg-blue-50 border-b border-blue-100">
                                        <p className="text-sm text-blue-800 font-medium">
                                            📋 Todos los productos ({products.length})
                                        </p>
                                        <p className="text-xs text-blue-600 mt-1">
                                            Haz clic en un producto para agregarlo al carrito
                                        </p>
                                    </div>
                                )}

                                <div className="divide-y divide-gray-200">
                                    {filteredProducts.map((product) => {
                                        const inCart = cart.find(item => item.product.id === product.id);
                                        return (
                                            <button
                                                key={product.id}
                                                onClick={() => addToCart(product)}
                                                disabled={product.stock === 0}

                                                // --- LÍNEA CORREGIDA ---
                                                // Se eliminó la '}' extra después de ''
                                                className={`w-full p-4 flex items-center space-x-4 hover:bg-gray-50 transition ${inCart ? 'bg-green-50 border-l-4 border-green-600' : ''} ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                                {inCart && (
                                                    <div className="flex items-center space-x-2">
                                                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                            {inCart.quantity}
                                                        </span>
                                                        <div className="text-green-600 text-xl">🛒</div>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Carrito de Compras */}
                <div>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-8">

                        {/* Gradiente Morado/Azul */}
                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 text-white">
                            <h2 className="text-2xl font-bold mb-2">Carrito de Venta</h2>
                            <p className="text-purple-100">
                                {cart.length === 0 ? 'Agrega productos al carrito' : `${cartItemsCount} producto(s) en el carrito`}
                            </p>
                        </div>

                        {cart.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="text-6xl mb-4">🛒</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    Carrito vacío
                                </h3>
                                <p className="text-gray-500">
                                    Selecciona productos para agregarlos al carrito
                                </p>
                            </div>
                        ) : (
                            <div>
                                <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-200">
                                    {cart.map((item) => (
                                        <div key={item.product.id} className="p-4">
                                            <div className="flex items-start space-x-3 mb-3">
                                                <img
                                                    src={item.product.image_url}
                                                    alt={item.product.name}
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=?';
                                                    }}
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-800">{item.product.name}</h4>
                                                    <p className="text-sm text-gray-600">${item.product.sale_price.toFixed(2)} c/u</p>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.product.id)}
                                                    className="text-red-500 hover:text-red-700 text-xl"
                                                >
                                                    🗑️
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                                        className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold"
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={item.product.stock}
                                                        value={item.quantity}
                                                        onChange={(e) => updateCartQuantity(item.product.id, parseInt(e.target.value) || 1)}
                                                        className="w-16 text-center border border-gray-300 rounded-lg py-1 font-semibold"
                                                    />
                                                    <button
                                                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                                        className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-gray-800">
                                                        ${(item.product.sale_price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 bg-blue-50 border-t-2 border-blue-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg font-bold text-gray-800">Total:</span>
                                        <span className="text-3xl font-bold text-green-600">
                                            ${cartTotal.toFixed(2)}
                                        </span>
                                    </div>

                                    <button
                                        onClick={handleCompleteSale}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg transition text-lg"
                                    >
                                        ✓ Completar Venta
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}