import { type Dispatch, type SetStateAction, type ReactNode } from 'react';

interface PageHeaderProps {
    title: ReactNode;
    showSettingsMenu: boolean;
    setShowSettingsMenu: Dispatch<SetStateAction<boolean>>;
}

export default function PageHeader({ title, showSettingsMenu, setShowSettingsMenu }: PageHeaderProps) {
    return (
        <header className="flex justify-between items-center mb-4 bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-xl shadow-md">
            <h1 className="text-3xl font-bold text-gray-700 dark:text-white">
                {title}
            </h1>
            
            {/* Botón de Configuración */}
            <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className={`text-gray-700 dark:text-gray-300 p-2 rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${showSettingsMenu ? 'bg-gray-100 dark:bg-gray-700 text-blue-500' : ''}`}
                title="Configuración"
            >
                {/* Ícono ⚙️ */}
                <svg className="w-8 h-8 transform transition-transform duration-300" 
                     xmlns="http://www.w3.org/2000/svg" 
                     viewBox="0 0 24 24" 
                     fill="none" 
                     stroke="currentColor" 
                     strokeWidth="2" 
                     strokeLinecap="round" 
                     strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
            </button>
        </header>
    );
}