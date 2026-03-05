import { useEffect, useState } from 'react';
import { UserCircle, Plus, Edit, Trash2, Search } from 'lucide-react';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { authStorage } from '../../services/authStorage';
import { customersApi } from '../../services/api';

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

    const fetchCustomers = async () => {
        try {
            const token = authStorage.getToken();
            if (!token) {
                setCustomers([]);
                return;
            }

            const response = await customersApi.getAll(token);
            setCustomers(response.data || []);
        } catch (error) {
            alert(error.message || 'Failed to load customers');
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleOpenModal = (customer = null) => {
        if (customer) {
            setEditingCustomer(customer);
            setFormData({
                name: customer.name || '',
                email: customer.email || '',
                phone: customer.phone || '',
                address: customer.address || ''
            });
        } else {
            setEditingCustomer(null);
            setFormData({ name: '', email: '', phone: '', address: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const name = formData.name.trim();
        const email = formData.email.trim();
        const phone = formData.phone.trim();
        const address = formData.address.trim();

        if (name.length < 2) {
            alert('Customer name must be at least 2 characters');
            return;
        }

        try {
            const token = authStorage.getToken();
            if (!token) {
                alert('Authentication required. Please login again.');
                return;
            }

            const payload = { name, email, phone, address };

            if (editingCustomer?._id) {
                await customersApi.update(editingCustomer._id, payload, token);
            } else {
                await customersApi.create(payload, token);
            }

            await fetchCustomers();
            setIsModalOpen(false);
        } catch (error) {
            alert(error.message || 'Failed to save customer');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this customer?')) {
            return;
        }

        try {
            const token = authStorage.getToken();
            if (!token) {
                alert('Authentication required. Please login again.');
                return;
            }

            await customersApi.remove(id, token);
            await fetchCustomers();
        } catch (error) {
            alert(error.message || 'Failed to delete customer');
        }
    };

    const filteredCustomers = customers.filter((customer) =>
        [customer.name, customer.email, customer.phone, customer.address]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Email', accessor: 'email', render: (row) => row.email || '-' },
        { header: 'Phone', accessor: 'phone', render: (row) => row.phone || '-' },
        { header: 'Receivables', accessor: 'receivables', render: (row) => `₹${Number(row.receivables || 0).toFixed(2)}` }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <UserCircle className="w-6 h-6 text-airbnb-600" />
                        Customers
                    </h1>
                    <p className="text-zinc-500 mt-1">Manage your customers</p>
                </div>
                <button onClick={() => handleOpenModal()} className="air-btn-primary">
                    <Plus className="w-4 h-4" />
                    New Customer
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-zinc-200 dark:border-gray-700 mb-6 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="air-input pl-10 py-2.5"
                    />
                </div>
            </div>

            <Table
                columns={columns}
                data={filteredCustomers}
                actions={(row) => (
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => handleOpenModal(row)} className="p-2 text-zinc-500 hover:text-airbnb-600 hover:bg-airbnb-50 dark:hover:bg-airbnb-700/20 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(row._id)} className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
            />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCustomer ? 'Edit Customer' : 'New Customer'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700 dark:text-gray-300">Customer Name</label>
                        <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="air-input" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700 dark:text-gray-300">Email</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="air-input" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700 dark:text-gray-300">Phone</label>
                        <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="air-input" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700 dark:text-gray-300">Billing Address</label>
                        <input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="air-input" />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-zinc-700 dark:text-gray-300 hover:bg-zinc-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" className="air-btn-primary">Save Customer</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
