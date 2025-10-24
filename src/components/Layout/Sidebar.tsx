import { supabase } from '../../lib/supabase';

interface SidebarProps {
    activeView: string;
    setActiveView: (view: string) => void;
    onLogout: () => void;
}

export default function Sidebar({ activeView, setActiveView, onLogout }: SidebarProps) {
    const handleLogout = async () => {
        await supabase.auth.signOut();
        onLogout();
    };

    const menuItems = [
        { id: 'sales', label: 'Ventas', icon: '💰' },
        { id: 'stock', label: 'Stock', icon: '📊' },
        { id: 'products', label: 'Productos', icon: '📦' },
        { id: 'records', label: 'Registros', icon: '📝' },
    ];

    return (
        <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col">
            <div className="p-6 border-b border-gray-700">
                <h2 className="text-2xl font-bold">Stock Manager</h2>
                <p className="text-gray-400 text-sm mt-1">Gestión de Inventario</p>
            </div>

            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => setActiveView(item.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeView === item.id
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-800'
                                    }`}
                            >
                                <span className="text-2xl">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition"
                >
                    <span className="text-2xl">🚪</span>
                    <span className="font-medium">Cerrar Sesión</span>
                </button>
            </div>
        </div>
    );
}