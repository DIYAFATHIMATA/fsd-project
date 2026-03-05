import { FileText } from 'lucide-react';
import ResourceManager from '../ResourceManager';

const config = {
    resourceKey: 'ims_credit_notes',
    columns: [
        { header: 'Credit Note#', accessor: 'noteId' },
        { header: 'Customer', accessor: 'customer' },
        { header: 'Amount', accessor: 'amount' }
    ],
    fields: [
        { name: 'noteId', label: 'Credit Note#', required: true },
        { name: 'customer', label: 'Customer', required: true },
        { name: 'amount', label: 'Credited Amount', type: 'number', required: true }
    ]
};

export default function CreditNotes() {
    return <ResourceManager title="Credit Notes" icon={FileText} {...config} />;
}
