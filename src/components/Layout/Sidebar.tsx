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

            {/* 1. Logo Superior */}
            <div className="p-6 border-b border-gray-700">
                <img
                    src="/logoblanco.png" // Tu logo de "Abrazo de Luz"
                    alt="Logo"
                    className="w-40 mx-auto"
                />
            </div>

            {/* 2. Sección de Navegación */}
            <nav className="p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => setActiveView(item.id)}
                                // --- LÍNEA MODIFICADA ---
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeView === item.id
                                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' // <-- ¡CAMBIO A GRADIENTE!
                                    : 'text-gray-300 hover:bg-gray-800'
                                    }`}
                            // --- FIN DE LÍNEA MODIFICADA ---
                            >
                                <span className="text-2xl">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* 3. Espaciador y Mandala */}
            <div className="flex-1 relative">
                <img
                    src="/mandala.png"
                    alt="Mandala"
                    className="absolute bottom-0 left-0 w-32 h-auto opacity-30 invert"
                />
            </div>

            {/* 4. Sección de Cerrar Sesión */}
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