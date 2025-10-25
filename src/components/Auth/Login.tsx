import { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface LoginProps {
    onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
    // --- LÓGICA (sin cambios) ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            onLogin();
        } catch (err: unknown) {
            setError((err as Error).message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };
    // --- FIN DE LA LÓGICA ---


    // --- INICIO DEL DISEÑO ESTÉTICO ---
    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 relative overflow-hidden">

            {/* --- Elementos Decorativos (sin cambios) --- */}
            {/* Círculo grande azul (izquierda) */}
            <div className="absolute w-96 h-96 bg-blue-700 rounded-full -left-48 -top-24 opacity-30" />
            {/* Círculo pequeño cian (izquierda) */}
            <div className="absolute w-12 h-12 bg-cyan-400 rounded-full left-32 top-32 opacity-70" />

            {/* Formas geométricas (derecha) */}
            {/* Cuadrado rotado */}
            <div className="absolute w-64 h-64 bg-blue-800 -bottom-32 -right-32 opacity-40 transform rotate-45" />
            {/* Líneas diagonales */}
            <div className="absolute w-72 h-4 bg-blue-600 top-24 -right-16 opacity-50 transform rotate-45" />
            <div className="absolute w-72 h-4 bg-blue-600 top-28 -right-16 opacity-50 transform rotate-45" />

            {/* Contenedor del Formulario (centrado y sobre los elementos) */}
            <div className="w-full max-w-xs z-10">

                {/* --- SECCIÓN DEL LOGO (MODIFICADA) --- */}
                <div className="text-center mb-12">

                    {/* Logo añadido */}
                    <img
                        src="/logo.png" // Accede al logo desde la carpeta /public
                        alt="Logo"
                        // w-32: Ancho (ajústalo si es necesario)
                        // mx-auto: Centrar
                        // mb-6: Margen inferior
                        // invert: ¡La magia! Invierte el color de negro a blanco
                        className="w-32 mx-auto mb-6 invert"
                    />

                    {/* Título "login" (sin cambios) */}
                    <h1 className="text-5xl font-thin text-white tracking-widest">
                        login
                    </h1>
                </div>
                {/* --- FIN DE LA SECCIÓN DEL LOGO --- */}


                <form onSubmit={handleLogin} className="space-y-8">
                    {/* Input de Email (sin cambios) */}
                    <div>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-transparent border-b border-gray-600 py-2 text-white placeholder-gray-400 outline-none focus:border-blue-400 transition-colors"
                            placeholder="Correo Electrónico"
                        />
                    </div>

                    {/* Input de Contraseña (sin cambios) */}
                    <div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-transparent border-b border-gray-600 py-2 text-white placeholder-gray-400 outline-none focus:border-blue-400 transition-colors"
                            placeholder="Contraseña"
                        />
                    </div>

                    {/* Mensaje de Error (sin cambios) */}
                    {error && (
                        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-2 rounded-lg text-sm text-center">
                            {/* Mostramos un mensaje genérico para errores comunes de Supabase */}
                            {error.includes('Invalid login credentials')
                                ? 'Email o contraseña incorrectos'
                                : 'Error al iniciar sesión'}
                        </div>
                    )}

                    {/* Botón de Login (sin cambios) */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Iniciando...' : 'login'}
                    </button>
                </form>
            </div>
        </div>
    );
}