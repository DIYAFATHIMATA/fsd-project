import { Truck } from 'lucide-react';
import ResourceManager from '../ResourceManager';

export default function DeliveryChallans() {
    return (
        <ResourceManager
            title="Delivery Challans"
            icon={Truck}
            resourceKey="ims_challans"
            columns={[
                { header: 'Challan#', accessor: 'challanId' },
                { header: 'Customer', accessor: 'customer' },
                { header: 'Date', accessor: 'date', render: (row) => row.date ? new Date(row.date).toLocaleDateString() : '-' },
                { header: 'Status', accessor: 'status' }
            ]}
            fields={[
                { name: 'challanId', label: 'Challan ID', required: true },
                { name: 'customer', label: 'Customer', required: true },
                { name: 'date', label: 'Date', type: 'date' },
                { name: 'status', label: 'Status', type: 'select', options: ['Delivered', 'In Transit', 'Pending'], required: true }
            ]}
        />
    );
}
