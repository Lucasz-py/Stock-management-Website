import { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

export default function SettingsButton() {
    const [showMenu, setShowMenu] = useState(false);
    const {
        darkMode,
        showInventoryValue,
        showProfitValue,
        showTotalRevenue, // NUEVO
        toggleDarkMode,
        toggleInventoryValue,
        toggleShowProfitValue,
        toggleShowTotalRevenue // NUEVO
    } = useSettings();

    return (
        <>
            {/* Botón flotante */}
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="fixed top-6 right-6 z-40 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                title="Configuración"
            >
                <span className="text-2xl">⚙️</span>
            </button>

            {/* Panel de configuración */}
            {showMenu && (
                <>
                    {/* Overlay para cerrar */}
                    <div
                        className="fixed inset-0 z-40 bg-black bg-opacity-30"
                        onClick={() => setShowMenu(false)}
                    />

                    {/* Panel */}
                    <div className="fixed top-20 right-6 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-80 overflow-hidden animate-slide-down">
                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-white">
                            <h3 className="text-lg font-bold">Configuración</h3>
                            <p className="text-sm text-purple-100">Personaliza tu experiencia</p>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Modo Oscuro */}
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800 dark:text-white">Modo Oscuro</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Tema oscuro para la vista</p>
                                </div>
                                <button
                                    onClick={toggleDarkMode}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${darkMode ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700"></div>

                            {/* Valor de Compra */}
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800 dark:text-white">Valor de Compra</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Mostrar en Stock</p>
                                </div>
                                <button
                                    onClick={toggleInventoryValue}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${showInventoryValue ? 'bg-purple-600' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${showInventoryValue ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Valor de Ganancias */}
                            <div className="border-t border-gray-200 dark:border-gray-700"></div>

                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800 dark:text-white">Valor de Ganancias</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Mostrar en Stock</p>
                                </div>
                                <button
                                    onClick={toggleShowProfitValue}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${showProfitValue ? 'bg-purple-600' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${showProfitValue ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* NUEVO BLOQUE: Ingresos Totales */}
                            <div className="border-t border-gray-200 dark:border-gray-700"></div>

                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800 dark:text-white">Ingresos Totales</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Ocultar en Registros</p>
                                </div>
                                <button
                                    onClick={toggleShowTotalRevenue}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${showTotalRevenue ? 'bg-purple-600' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${showTotalRevenue ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}