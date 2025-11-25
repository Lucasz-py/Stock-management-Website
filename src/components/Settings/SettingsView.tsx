import type { Dispatch, SetStateAction } from 'react'; // Importación de tipos
import { useSettings } from '../../contexts/SettingsContext';
import MainLayout from '../Layout/MainLayout';
import PageHeader from '../Layout/PageHeader'; // Importado

// NUEVA INTERFACE: Prop para recibir la función de configuración (aunque solo se usa para el PageHeader)
interface SettingsViewProps {
    setShowSettingsMenu: Dispatch<SetStateAction<boolean>>;
}

// CAMBIO: Recibe la prop
export default function SettingsView({ setShowSettingsMenu }: SettingsViewProps) {
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
        // CORREGIDO: Se elimina title="Configuración"
        <MainLayout>
            {/* NUEVO: Page Header con el título de la vista */}
            <PageHeader
                title="Configuración"
                // En la vista de Configuración, podemos desactivar el botón 
                // para que no abra el menú flotante sobre sí mismo.
                showSettingsMenu={false} 
                setShowSettingsMenu={setShowSettingsMenu}
            />

            <div className="max-w-2xl">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Apariencia y Preferencias
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Personaliza la experiencia de la aplicación
                        </p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Modo Oscuro */}
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">
                                    Modo Oscuro
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Cambia entre tema claro y oscuro para reducir la fatiga visual
                                </p>
                            </div>

                            <button
                                onClick={toggleDarkMode}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${darkMode ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700"></div>

                        {/* Mostrar Valor de Compra */}
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">
                                    Mostrar Valor de Compra
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Muestra u oculta el valor de compra del inventario en la sección de Stock
                                </p>
                            </div>

                            <button
                                onClick={toggleInventoryValue}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${showInventoryValue ? 'bg-green-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${showInventoryValue ? 'translate-x-7' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Mostrar Reporte de Ganancias */}
                        <div className="border-t border-gray-200 dark:border-gray-700"></div>

                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">
                                    Mostrar Reporte de Ganancias
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Muestra la tarjeta de venta total y ganancia potencial en la sección de Stock
                                </p>
                            </div>

                            <button
                                onClick={toggleShowProfitValue}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${showProfitValue ? 'bg-purple-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${showProfitValue ? 'translate-x-7' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* NUEVO BLOQUE: Mostrar Ingresos Totales */}
                        <div className="border-t border-gray-200 dark:border-gray-700"></div>

                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">
                                    Mostrar Ingresos Totales
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Muestra u oculta los ingresos totales en la tarjeta de Registros
                                </p>
                            </div>

                            <button
                                onClick={toggleShowTotalRevenue}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${showTotalRevenue ? 'bg-green-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${showTotalRevenue ? 'translate-x-7' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Información adicional */}
                <div className="mt-6 bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-gray-700 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                        <div className="text-2xl">ℹ️</div>
                        <div className="flex-1">
                            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-1">
                                Configuración guardada automáticamente
                            </h4>
                            <p className="text-sm text-blue-800 dark:text-blue-400">
                                Tus preferencias se guardan localmente y se mantendrán al cerrar y abrir la aplicación.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}