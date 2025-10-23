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
        <tr className="hover:bg-gray-50 transition">
            <td className="px-6 py-4">
                <div className="text-sm text-gray-500">{formattedDate}</div>
                <div className="text-xs text-gray-400">{formattedTime}</div>
            </td>
            <td className="px-6 py-4">
                <div className="font-medium text-gray-800">{sale.product_name}</div>
            </td>
            <td className="px-6 py-4">
                <span className="text-gray-800 font-semibold">{sale.quantity}</span>
            </td>
            <td className="px-6 py-4">
                <span className="text-gray-800">${sale.sale_price.toFixed(2)}</span>
            </td>
            <td className="px-6 py-4">
                <span className="text-lg font-bold text-green-600">
                    ${sale.total.toFixed(2)}
                </span>
            </td>
        </tr>
    );
}