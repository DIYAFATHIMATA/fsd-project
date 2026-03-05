import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Phone, Mail } from 'lucide-react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { authStorage } from '../services/authStorage';
import { resourceApi } from '../services/api';

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [formData, setFormData] = useState({ name: '', contact: '', gst: '', email: '', address: '' });

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const token = authStorage.getToken();
            if (!token) {
                setSuppliers([]);
                return;
            }
            const response = await resourceApi.getAll('ims_suppliers', token);
            setSuppliers(response.data || []);
        } catch (error) {
            alert(error.message || 'Failed to load suppliers');
        }
    };

    const handleOpenModal = (supplier = null) => {
        if (supplier) {
            setEditingSupplier(supplier);
            setFormData(supplier);
        } else {
            setEditingSupplier(null);
            setFormData({ name: '', contact: '', gst: '', email: '', address: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = authStorage.getToken();
            if (!token) {
                alert('Authentication required. Please login again.');
                return;
            }

            if (editingSupplier?._id) {
                await resourceApi.update('ims_suppliers', editingSupplier._id, formData, token);
            } else {
                await resourceApi.create('ims_suppliers', formData, token);
            }

            await fetchSuppliers();
            setIsModalOpen(false);
        } catch (error) {
            alert(error.message || 'Failed to save supplier');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete supplier?')) {
            try {
                const token = authStorage.getToken();
                if (!token) {
                    alert('Authentication required. Please login again.');
                    return;
                }
                await resourceApi.remove('ims_suppliers', id, token);
                await fetchSuppliers();
            } catch (error) {
                alert(error.message || 'Failed to delete supplier');
            }
        }
    };

    const columns = [
        {
            header: 'Supplier Name', accessor: 'name', render: (row) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-white">{row.name}</div>
                    <div className="text-xs text-gray-500">{row.gst}</div>
                </div>
            )
        },
        {
            header: 'Contact', accessor: 'contact', render: row => (
                <div className="flex flex-col text-sm gap-1">
                    <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> {row.contact}</div>
                    {row.email && <div className="flex items-center gap-1"><Mail className="w-3 h-3" /> {row.email}</div>}
                </div>
            )
        },
        { header: 'Address', accessor: 'address', render: row => <span className="text-sm text-gray-500 truncate max-w-xs block">{row.address || '-'}</span> },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Suppliers</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage vendor relationships</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Supplier
                </button>
            </div>

            <Table
                columns={columns}
                data={suppliers}
                actions={(row) => (
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => handleOpenModal(row)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(row._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                        <input
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact</label>
                            <input
                                required
                                value={formData.contact}
                                onChange={e => setFormData({ ...formData, contact: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">GSTIN</label>
                            <input
                                value={formData.gst}
                                onChange={e => setFormData({ ...formData, gst: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email (Optional)</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address (Optional)</label>
                        <textarea
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            rows="2"
                        />
                    </div>
                    <button className="w-full py-2 bg-blue-600 text-white rounded-lg">Save Supplier</button>
                </form>
            </Modal>
        </div>
    );
}
