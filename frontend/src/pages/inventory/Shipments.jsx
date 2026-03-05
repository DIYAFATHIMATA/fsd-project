import { useEffect, useState } from 'react';
import { Truck, Plus, Search, Edit, Trash2 } from 'lucide-react';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { authStorage } from '../../services/authStorage';
import { shipmentsApi } from '../../services/api';

export default function Shipments() {
    const [rows, setRows] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRow, setEditingRow] = useState(null);
    const [formData, setFormData] = useState({
        shipmentNum: '',
        carrier: '',
        tracking: '',
        status: ''
    });

    const fetchRows = async () => {
        try {
            const token = authStorage.getToken();
            if (!token) {
                setRows([]);
                return;
            }

            const response = await shipmentsApi.getAll(token);
            setRows(response.data || []);
        } catch (error) {
            alert(error.message || 'Failed to load shipments');
        }
    };

    useEffect(() => {
        fetchRows();
    }, []);

    const handleOpenModal = (row = null) => {
        if (row) {
            setEditingRow(row);
            setFormData({
                shipmentNum: row.shipmentNum || '',
                carrier: row.carrier || '',
                tracking: row.tracking || '',
                status: row.status || ''
            });
        } else {
            setEditingRow(null);
            setFormData({ shipmentNum: '', carrier: '', tracking: '', status: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            shipmentNum: formData.shipmentNum.trim(),
            carrier: formData.carrier.trim(),
            tracking: formData.tracking.trim(),
            status: formData.status
        };

        if (!payload.shipmentNum || !payload.carrier || !payload.tracking || !payload.status) {
            alert('Shipment number, carrier, tracking and status are required');
            return;
        }

        try {
            const token = authStorage.getToken();
            if (!token) {
                alert('Authentication required. Please login again.');
                return;
            }

            if (editingRow?._id) {
                await shipmentsApi.update(editingRow._id, payload, token);
            } else {
                await shipmentsApi.create(payload, token);
            }

            await fetchRows();
            setIsModalOpen(false);
        } catch (error) {
            alert(error.message || 'Failed to save shipment');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this shipment?')) {
            return;
        }

        try {
            const token = authStorage.getToken();
            if (!token) {
                alert('Authentication required. Please login again.');
                return;
            }

            await shipmentsApi.remove(id, token);
            await fetchRows();
        } catch (error) {
            alert(error.message || 'Failed to delete shipment');
        }
    };

    const filteredRows = rows.filter((row) =>
        [row.shipmentNum, row.carrier, row.tracking, row.status]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const columns = [
        { header: 'Shipment#', accessor: 'shipmentNum' },
        { header: 'Carrier', accessor: 'carrier' },
        { header: 'Tracking', accessor: 'tracking' },
        { header: 'Status', accessor: 'status' }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <Truck className="w-6 h-6 text-airbnb-600" />
                        Shipments
                    </h1>
                    <p className="text-zinc-500 mt-1">Manage your shipments</p>
                </div>
                <button onClick={() => handleOpenModal()} className="air-btn-primary">
                    <Plus className="w-4 h-4" />
                    New Shipment
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-zinc-200 dark:border-gray-700 mb-6 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search shipments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="air-input pl-10 py-2.5"
                    />
                </div>
            </div>

            <Table
                columns={columns}
                data={filteredRows}
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRow ? 'Edit Shipment' : 'New Shipment'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700 dark:text-gray-300">Shipment Order#</label>
                        <input required value={formData.shipmentNum} onChange={(e) => setFormData({ ...formData, shipmentNum: e.target.value })} className="air-input" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700 dark:text-gray-300">Carrier</label>
                        <input required value={formData.carrier} onChange={(e) => setFormData({ ...formData, carrier: e.target.value })} className="air-input" placeholder="FedEx/DHL" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700 dark:text-gray-300">Tracking Number</label>
                        <input required value={formData.tracking} onChange={(e) => setFormData({ ...formData, tracking: e.target.value })} className="air-input" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700 dark:text-gray-300">Status</label>
                        <select required value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="air-input">
                            <option value="">Select Status</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-zinc-700 dark:text-gray-300 hover:bg-zinc-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" className="air-btn-primary">Save Shipment</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
