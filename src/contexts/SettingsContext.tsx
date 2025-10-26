import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface SettingsContextType {
    darkMode: boolean;
    showInventoryValue: boolean;
    showProfitValue: boolean;
    showTotalRevenue: boolean; // NUEVO
    toggleDarkMode: () => void;
    toggleInventoryValue: () => void;
    toggleShowProfitValue: () => void;
    toggleShowTotalRevenue: () => void; // NUEVO
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    const [showInventoryValue, setShowInventoryValue] = useState(() => {
        const saved = localStorage.getItem('showInventoryValue');
        return saved ? JSON.parse(saved) : true;
    });

    const [showProfitValue, setShowProfitValue] = useState(() => {
        const saved = localStorage.getItem('showProfitValue');
        return saved ? JSON.parse(saved) : true;
    });

    // NUEVO ESTADO para Ingresos Totales
    const [showTotalRevenue, setShowTotalRevenue] = useState(() => {
        const saved = localStorage.getItem('showTotalRevenue');
        return saved ? JSON.parse(saved) : true; // Activado por defecto
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    useEffect(() => {
        localStorage.setItem('showInventoryValue', JSON.stringify(showInventoryValue));
    }, [showInventoryValue]);

    useEffect(() => {
        localStorage.setItem('showProfitValue', JSON.stringify(showProfitValue));
    }, [showProfitValue]);

    // NUEVO EFFECT para Ingresos Totales
    useEffect(() => {
        localStorage.setItem('showTotalRevenue', JSON.stringify(showTotalRevenue));
    }, [showTotalRevenue]);

    const toggleDarkMode = () => setDarkMode(!darkMode);
    const toggleInventoryValue = () => setShowInventoryValue(!showInventoryValue);
    const toggleShowProfitValue = () => setShowProfitValue(!showProfitValue);
    const toggleShowTotalRevenue = () => setShowTotalRevenue(!showTotalRevenue); // NUEVA FUNCIÓN

    return (
        <SettingsContext.Provider
            value={{
                darkMode,
                showInventoryValue,
                showProfitValue,
                showTotalRevenue, // NUEVO
                toggleDarkMode,
                toggleInventoryValue,
                toggleShowProfitValue,
                toggleShowTotalRevenue // NUEVO
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
}