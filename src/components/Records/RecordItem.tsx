import { type Sale } from '../../types';

interface RecordItemProps {
    sale: Sale;
}

export default function RecordItem({ sale }: RecordItemProps) {
    const date = new Date(sale.created_at);
    const formattedDate = date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        // CAMBIO 1: Se agregó dark:hover:bg-gray-700
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <td className="px-6 py-4">
                {/* CAMBIO 2: Se agregaron clases dark: para el texto */}
                <div className="text-sm text-gray-500 dark:text-gray-300">{formattedDate}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500">{formattedTime}</div>
            </td>
            <td className="px-6 py-4">
                <div className="font-medium text-gray-800 dark:text-white">{sale.product_name}</div>
            </td>
            <td className="px-6 py-4">
                <span className="text-gray-800 dark:text-gray-100 font-semibold">{sale.quantity}</span>
            </td>
            <td className="px-6 py-4">
                <span className="text-gray-800 dark:text-gray-100">${sale.sale_price.toFixed(2)}</span>
            </td>
            <td className="px-6 py-4">
                {/* CAMBIO 3: Se agregó el color de texto para modo oscuro */}
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    ${sale.total.toFixed(2)}
                </span>
            </td>
        </tr>
    );
}