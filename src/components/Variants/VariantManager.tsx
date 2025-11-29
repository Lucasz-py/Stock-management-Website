import { useState, useEffect } from 'react';
import { type Product, type ProductVariant } from '../../types';
import { 
    getVariantsByProductId, 
    addVariant, 
    updateVariant, 
    deleteVariant,
    updateParentProductStock 
} from '../../lib/supabase';
import { Trash2, Edit2, Plus, Save, X, Package} from 'lucide-react'; // Agregué 'Palette'

interface VariantManagerProps {
    product: Product;
    onClose: () => void;
    onVariantsUpdated: () => void;
}

export default function VariantManager({ product, onClose, onVariantsUpdated }: VariantManagerProps) {
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [imageError, setImageError] = useState(false);
    
    const [isEditing, setIsEditing] = useState<string | null>(null);
    
    // CAMBIO: Agregamos 'color' al estado inicial
    const [formData, setFormData] = useState({
        name: '',
        color: '#8B5CF6', // Color por defecto (Violeta)
    });

    useEffect(() => {
        loadVariants();
        setImageError(false);
    }, [product.id]);

    const loadVariants = async () => {
        try {
            setLoading(true);
            const data = await getVariantsByProductId(product.id);
            setVariants(data || []);
        } catch (err) {
            console.error(err);
            setError('Error al cargar variantes');
        } finally {
            setLoading(false);
        }
    };

    // CAMBIO: Manejo genérico para inputs (texto y color)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (isEditing) {
                await updateVariant(isEditing, {
                    name: formData.name,
                    color: formData.color, // Guardamos color
                });
            } else {
                await addVariant({
                    product_id: product.id,
                    name: formData.name,
                    color: formData.color, // Guardamos color
                    stock: 0,          
                    purchase_price: 0, 
                    sale_price: 0      
                });
            }

            await updateParentProductStock(product.id);
            await loadVariants();
            resetForm();
            onVariantsUpdated();

        } catch (err) {
            console.error(err);
            setError('Error al guardar');
        }
    };

    const handleEditClick = (variant: ProductVariant) => {
        setIsEditing(variant.id);
        setFormData({
            name: variant.name,
            color: variant.color || '#8B5CF6', // Cargar color existente
        });
    };

    const handleDeleteClick = async (id: string) => {
        if (!confirm('¿Estás seguro?')) return;
        try {
            await deleteVariant(id);
            await updateParentProductStock(product.id);
            await loadVariants();
            onVariantsUpdated();
        } catch (err) {
            setError('Error al eliminar');
        }
    };

    const resetForm = () => {
        setIsEditing(null);
        setFormData({ name: '', color: '#8B5CF6' });
    };

    const handleClose = () => {
        onVariantsUpdated();
        onClose();
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Sin+Imagen';
        setImageError(true);
    };

    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative">
                
                <button onClick={handleClose} className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition z-10">
                    <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>

                {/* COLUMNA IZQUIERDA: IMAGEN */}
                <div className="md:w-1/3 h-48 md:h-auto bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative">
                    <img src={product.image_url} alt={product.name} className={`w-full h-full object-cover transition-opacity duration-300 ${imageError ? 'opacity-50' : 'opacity-100'}`} onError={handleImageError} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-4 left-4 text-white md:hidden">
                        <p className="font-bold text-lg drop-shadow-md">{product.name}</p>
                    </div>
                </div>

                {/* COLUMNA DERECHA: CONTENIDO */}
                <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-gray-900">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <Package className="text-purple-600" /> Variantes: {product.name}
                        </h2>
                        <div className="flex gap-4 mt-2 text-sm">
                            <p className="text-gray-500 dark:text-gray-400">Total Stock: <span className="font-bold text-green-600">{totalStock}</span></p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                            
                            {/* FORMULARIO */}
                            <div>
                                <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 sticky top-0">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                        {isEditing ? <Edit2 className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}
                                        {isEditing ? 'Editar Variante' : 'Nueva Variante'}
                                    </h3>
                                    
                                    <form onSubmit={handleSave} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase">Aroma / Nombre</label>
                                            <input 
                                                type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Ej: Sándalo"
                                                className="w-full px-3 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none dark:text-white"
                                            />
                                        </div>

                                        {/* NUEVO CAMPO: COLOR */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase">Color Distintivo</label>
                                            <div className="flex items-center gap-3">
                                                <input 
                                                    type="color" name="color" value={formData.color} onChange={handleInputChange}
                                                    className="h-10 w-20 p-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                                                />
                                                <span className="text-sm text-gray-500 dark:text-gray-400">Elige un color para identificarlo</span>
                                            </div>
                                        </div>

                                        {error && <p className="text-red-500 text-sm">{error}</p>}

                                        <div className="flex gap-2 pt-2">
                                            {isEditing && (
                                                <button type="button" onClick={resetForm} className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 transition">Cancelar</button>
                                            )}
                                            <button type="submit" className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex justify-center items-center gap-2">
                                                <Save className="w-4 h-4" /> {isEditing ? 'Actualizar' : 'Agregar'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* LISTA */}
                            <div className="flex flex-col h-full overflow-hidden">
                                {loading ? (
                                    <div className="text-center py-12 text-gray-500">Cargando...</div>
                                ) : variants.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-dashed border-2 border-gray-300 dark:border-gray-700 flex-1 flex flex-col justify-center items-center">
                                        <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                                        <p className="text-gray-500 dark:text-gray-400">No hay variantes.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 max-h-[400px]">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase text-xs sticky top-0 z-10">
                                                <tr>
                                                    <th className="px-4 py-3">Color</th> {/* Columna Color */}
                                                    <th className="px-4 py-3">Variante</th>
                                                    <th className="px-4 py-3 text-center">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                                                {variants.map((v) => (
                                                    <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                                        <td className="px-4 py-3">
                                                            <div className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600" style={{ backgroundColor: v.color || '#ccc' }}></div>
                                                        </td>
                                                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">{v.name}</td>
                                                        <td className="px-4 py-3 flex justify-center gap-2">
                                                            <button onClick={() => handleEditClick(v)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
                                                            <button onClick={() => handleDeleteClick(v.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}