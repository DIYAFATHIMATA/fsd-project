import { Receipt } from 'lucide-react';
import ResourceManager from '../ResourceManager';

const config = {
    resourceKey: 'ims_expenses',
    columns: [
        { header: 'Date', accessor: 'date', render: (row) => row.date },
        { header: 'Category', accessor: 'category' },
        { header: 'Amount', accessor: 'amount', render: (row) => `₹${row.amount}` },
        { header: 'Paid Through', accessor: 'paidThrough' }
    ],
    fields: [
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'category', label: 'Category', type: 'select', options: ['Travel', 'Meals', 'Office Supplies', 'Rent', 'Salaries'], required: true },
        { name: 'amount', label: 'Amount', type: 'number', required: true },
        { name: 'paidThrough', label: 'Paid Through', type: 'select', options: ['Petty Cash', 'Bank Account'], required: true }
    ]
};

export default function Expenses() {
    return <ResourceManager title="Expenses" icon={Receipt} {...config} />;
}
