import { type ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
    // ELIMINAMOS la prop 'title' ya que PageHeader la maneja dentro de 'children'
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="ml-64 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            {/* CAMBIO CLAVE: Cambiamos p-8 (padding en todos lados) por px-8 (padding horizontal) 
               y pt-4 (padding superior pequeño) para dar espacio al PageHeader sin tocar el borde. 
               El PageHeader tiene su propio padding y shadow. */}
            <div className="px-8 pt-4"> 
                {children}
            </div>
        </div>
    );
}