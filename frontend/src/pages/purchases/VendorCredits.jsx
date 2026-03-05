import { FileText } from 'lucide-react';
import ResourceManager from '../ResourceManager';

export default function VendorCredits() {
    return (
        <ResourceManager
            title="Vendor Credits"
            icon={FileText}
            resourceKey="ims_vendor_credits"
            columns={[
                { header: 'Credit#', accessor: 'creditId' },
                { header: 'Supplier', accessor: 'supplier' },
                { header: 'Amount', accessor: 'amount', render: (row) => `₹${Number(row.amount || 0).toFixed(2)}` }
            ]}
            fields={[
                { name: 'creditId', label: 'Credit#', required: true },
                { name: 'supplier', label: 'Supplier', required: true },
                { name: 'amount', label: 'Amount', type: 'number', required: true }
            ]}
        />
    );
}
