import { type Sale } from '../../types';
import { Banknote, CreditCard } from 'lucide-react'; // Importamos iconos

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
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <td className="px-6 py-4">
                <div className="text-sm text-gray-500 dark:text-gray-300">{formattedDate}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500">{formattedTime}</div>
            </td>
            <td className="px-6 py-4">
                <div className="font-medium text-gray-800 dark:text-white">{sale.product_name}</div>
            </td>
            
            {/* NUEVA CELDA: Método de Pago */}
            <td className="px-6 py-4">
                {sale.payment_method === 'cash' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        <Banknote className="w-3.5 h-3.5" />
                        Efectivo
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        <CreditCard className="w-3.5 h-3.5" />
                        Transfer.
                    </span>
                )}
            </td>

            <td className="px-6 py-4">
                <span className="text-gray-800 dark:text-gray-100 font-semibold">{sale.quantity}</span>
            </td>
            <td className="px-6 py-4">
                <span className="text-gray-800 dark:text-gray-100">${sale.sale_price.toFixed(2)}</span>
            </td>
            <td className="px-6 py-4">
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    ${sale.total.toFixed(2)}
                </span>
            </td>
        </tr>
    );
}