import { FileText } from 'lucide-react';
import ResourceManager from '../ResourceManager';

const config = {
    resourceKey: 'ims_sales',
    canCreate: false,
    columns: [
        { header: 'Date', accessor: 'date', render: (row) => new Date(row.date || Date.now()).toLocaleDateString() },
        { header: 'Invoice#', accessor: 'invoiceId' },
        { header: 'Customer', accessor: 'customerName' },
        { header: 'Amount', accessor: 'total', render: (row) => `₹${Number(row.total).toFixed(2)}` },
        { header: 'Status', accessor: 'status', render: () => 'Paid' }
    ],
    fields: []
};

export default function Invoices() {
    return <ResourceManager title="Invoices" icon={FileText} {...config} />;
}
