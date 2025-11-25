import type { Dispatch, SetStateAction } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

// El componente ahora acepta props para controlar su visibilidad
interface SettingsPanelProps {
    showMenu: boolean;
    setShowMenu: Dispatch<SetStateAction<boolean>>;
}

export default function SettingsPanel({ showMenu, setShowMenu }: SettingsPanelProps) { 
    const {
        darkMode,
        showInventoryValue,
        showProfitValue,
        showTotalRevenue,
        toggleDarkMode,
        toggleInventoryValue,
        toggleShowProfitValue,
        toggleShowTotalRevenue
    } = useSettings();

    return (
        <>
            {/* Panel de configuración */}
            {showMenu && (
                <>
                    {/* Overlay para cerrar */}
                    <div
                        className="fixed inset-0 z-40 bg-black bg-opacity-30"
                        onClick={() => setShowMenu(false)}
                    />

                    {/* AJUSTE DE POSICIÓN: top-12 (más arriba) y right-10 (más a la izquierda) */}
                    <div className="fixed top-5 right-12 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-80 overflow-hidden animate-slide-down">
                        <div className="bg-gradient-to-r from-abrazo-dark via-abrazo-mid to-abrazo-dark p-4 text-white">
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