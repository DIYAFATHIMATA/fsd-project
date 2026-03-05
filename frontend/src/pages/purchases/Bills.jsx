import { FileText } from 'lucide-react';
import ResourceManager from '../ResourceManager';

export default function Bills() {
    return (
        <ResourceManager
            title="Bills"
            icon={FileText}
            resourceKey="ims_bills"
            columns={[
                { header: 'Bill#', accessor: 'billId' },
                { header: 'Supplier', accessor: 'supplier' },
                { header: 'Amount', accessor: 'amount', render: (row) => `₹${Number(row.amount || 0).toFixed(2)}` },
                { header: 'Status', accessor: 'status' }
            ]}
            fields={[
                { name: 'billId', label: 'Bill#', required: true },
                { name: 'supplier', label: 'Supplier', required: true },
                { name: 'amount', label: 'Amount', type: 'number', required: true },
                { name: 'dueDate', label: 'Due Date', type: 'date' },
                { name: 'status', label: 'Status', type: 'select', options: ['Open', 'Paid'], required: true }
            ]}
        />
    );
}
