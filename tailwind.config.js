/** @type {import('tailwindcss').Config} */

// 1. Importamos el tema por defecto de Tailwind
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // ← AGREGADO: Habilita modo oscuro con clase
    theme: {
        extend: {
            // 2. Agregamos la nueva configuración de fuente
            fontFamily: {
                // Hacemos que 'sans' (la fuente por defecto) use Montserrat
                sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [],
}