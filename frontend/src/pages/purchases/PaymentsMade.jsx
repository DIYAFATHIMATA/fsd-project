import { CreditCard } from 'lucide-react';
import ResourceManager from '../ResourceManager';

export default function PaymentsMade() {
    return (
        <ResourceManager
            title="Payments Made"
            icon={CreditCard}
            resourceKey="ims_vendor_payments"
            columns={[
                { header: 'Payment#', accessor: 'paymentId' },
                { header: 'Supplier', accessor: 'supplier' },
                { header: 'Amount', accessor: 'amount', render: (row) => `₹${Number(row.amount || 0).toFixed(2)}` },
                { header: 'Mode', accessor: 'mode' }
            ]}
            fields={[
                { name: 'paymentId', label: 'Payment#', required: true },
                { name: 'supplier', label: 'Supplier', required: true },
                { name: 'amount', label: 'Amount', type: 'number', required: true },
                { name: 'mode', label: 'Mode', type: 'select', options: ['Cash', 'Bank Transfer', 'UPI', 'Cheque'], required: true }
            ]}
        />
    );
}
