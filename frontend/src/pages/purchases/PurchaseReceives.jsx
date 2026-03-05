import { Archive } from 'lucide-react';
import ResourceManager from '../ResourceManager';

export default function PurchaseReceives() {
    return (
        <ResourceManager
            title="Purchase Receives"
            icon={Archive}
            resourceKey="ims_receives"
            columns={[
                { header: 'Receive#', accessor: 'receiveId' },
                { header: 'Date', accessor: 'date', render: (row) => row.date ? new Date(row.date).toLocaleDateString() : '-' },
                { header: 'Supplier', accessor: 'supplier' },
                { header: 'Status', accessor: 'status' }
            ]}
            fields={[
                { name: 'receiveId', label: 'Receive#', required: true },
                { name: 'date', label: 'Date', type: 'date', required: true },
                { name: 'supplier', label: 'Supplier', required: true },
                { name: 'status', label: 'Status', type: 'select', options: ['Received', 'Pending'], required: true }
            ]}
        />
    );
}
