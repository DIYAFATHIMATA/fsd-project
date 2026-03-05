import { Undo2 } from 'lucide-react';
import ResourceManager from '../ResourceManager';

const config = {
    resourceKey: 'ims_returns',
    columns: [
        { header: 'Return#', accessor: 'returnId' },
        { header: 'Customer', accessor: 'customer' },
        { header: 'Status', accessor: 'status' }
    ],
    fields: [
        { name: 'returnId', label: 'Return ID', required: true },
        { name: 'customer', label: 'Customer', required: true },
        { name: 'reason', label: 'Reason' },
        { name: 'status', label: 'Status', type: 'select', options: ['Received', 'Pending'], required: true }
    ]
};

export default function SalesReturns() {
    return <ResourceManager title="Sales Returns" icon={Undo2} {...config} />;
}
