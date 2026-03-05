import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { resourceApi } from '../services/api';
import { authStorage } from '../services/authStorage';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = authStorage.getToken();
            if (!token) {
                setCategories([]);
                return;
            }
            const response = await resourceApi.getAll('ims_categories', token);
            setCategories(response.data || []);
        } catch (error) {
            alert(error.message || 'Failed to load categories');
        }
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData(category);
        } else {
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
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

            if (editingCategory?._id) {
                await resourceApi.update('ims_categories', editingCategory._id, formData, token);
            } else {
                await resourceApi.create('ims_categories', formData, token);
            }

            await fetchCategories();
            setIsModalOpen(false);
        } catch (error) {
            alert(error.message || 'Failed to save category');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this category?')) {
            try {
                const token = authStorage.getToken();
                if (!token) {
                    alert('Authentication required. Please login again.');
                    return;
                }
                await resourceApi.remove('ims_categories', id, token);
                await fetchCategories();
            } catch (error) {
                alert(error.message || 'Failed to delete category');
            }
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Description', accessor: 'description' },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage product categories</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Category
                </button>
            </div>

            <Table
                columns={columns}
                data={categories}
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
                title={editingCategory ? 'Edit Category' : 'Add Category'}
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
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <input
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button className="w-full py-2 bg-blue-600 text-white rounded-lg">Save</button>
                </form>
            </Modal>
        </div>
    );
}
