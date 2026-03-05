import { CreditCard } from 'lucide-react';
import ResourceManager from '../ResourceManager';

const config = {
    resourceKey: 'ims_payments_received',
    canCreate: false,
    canEdit: false,
    canDelete: false,
    columns: [
        { header: 'Bill#', accessor: 'invoiceId', render: (row) => row.invoiceId || row.paymentId || '-' },
        { header: 'Customer', accessor: 'customer' },
        {
            header: 'Products',
            accessor: 'productSummary',
            render: (row) => {
                if (row.productSummary) return row.productSummary;
                if (Array.isArray(row.products) && row.products.length > 0) {
                    return row.products.map((p) => `${p.name || 'Item'} x${p.quantity || 1}`).join(', ');
                }
                return '-';
            }
        },
        { header: 'Amount', accessor: 'amount', render: (row) => `₹${Number(row.amount || 0).toFixed(2)}` },
        { header: 'Mode', accessor: 'mode', render: (row) => row.mode || 'Cash' }
    ],
    fields: []
};

export default function PaymentsReceived() {
    return <ResourceManager title="Payments Received" icon={CreditCard} {...config} />;
}
