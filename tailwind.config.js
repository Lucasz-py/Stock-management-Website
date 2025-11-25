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
            // 3. AÑADIMOS LOS COLORES PERSONALIZADOS PARA EL GRADIENTE
            colors: {
                'abrazo-light': '#d27be9', // Color más claro (to: #d27be9)
                'abrazo-mid': '#b450ee',   // Color medio (via: #b450ee)
                'abrazo-dark': '#871ff7',  // Color más oscuro (from: #871ff7)
            },
            boxShadow: {
                'inset-green': 'inset 4px 0 0 0 #4ade80', // green-400
              },
        },
    },
    plugins: [],
}