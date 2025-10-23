import { type ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
    title: string;
}

export default function MainLayout({ children, title }: MainLayoutProps) {
    return (
        <div className="ml-64 min-h-screen bg-gray-50">
            <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
                {children}
            </div>
        </div>
    );
}