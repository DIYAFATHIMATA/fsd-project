import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { inventoryApi, resourceApi } from '../services/api';
import { authStorage } from '../services/authStorage';

export default function Inventory() {
    const [products, setProducts] = useState([]);
    const [stockHistory, setStockHistory] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        costPrice: '',
        stock: '',
        gst: '18',
        sku: ''
    });

    const fetchCategories = async (token) => {
        const categoriesResponse = await resourceApi.getAll('ims_categories', token);
        setCategories(categoriesResponse.data || []);
    };

    const fetchProducts = async () => {
        try {
            const token = authStorage.getToken();
            if (!token) {
                setProducts([]);
                setStockHistory([]);
                setCategories([]);
                return;
            }

            const [productsResponse, txnsResponse] = await Promise.all([
                inventoryApi.getItems(token),
                inventoryApi.getStockTransactions(token, 8)
            ]);

            setProducts(productsResponse.data || []);
            setStockHistory(txnsResponse.data || []);
            await fetchCategories(token);
        } catch (error) {
            alert(error.message || 'Failed to load inventory');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleOpenModal = async (product = null) => {
        try {
            const token = authStorage.getToken();
            if (token) {
                await fetchCategories(token);
            }
        } catch {
            setCategories([]);
        }

        if (product) {
            setEditingProduct(product);
            setFormData(product);
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                category: '',
                price: '',
                costPrice: '',
                stock: '',
                gst: '18',
                sku: `PROD-${Date.now().toString().slice(-6)}` // Auto-gen SKU
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = formData.name.trim();
        const category = formData.category.trim();
        const price = Number(formData.price);
        const costPrice = Number(formData.costPrice);
        const stock = Number(formData.stock);
        const gst = Number(formData.gst);

        if (name.length < 2) return alert('Product name must be at least 2 characters');
        if (!category) return alert('Please select a category');
        if (!Number.isFinite(price) || price <= 0) return alert('Selling price must be greater than 0');
        if (!Number.isFinite(costPrice) || costPrice < 0) return alert('Cost price cannot be negative');
        if (!Number.isInteger(stock) || stock < 0) return alert('Stock must be a non-negative whole number');
        if (![0, 5, 12, 18, 28].includes(gst)) return alert('GST must be one of 0, 5, 12, 18, 28');

        const payload = {
            ...formData,
            name,
            category,
            price,
            costPrice,
            stock,
            gst
        };

        try {
            const token = authStorage.getToken();
            if (!token) {
                alert('Authentication required. Please login again.');
                return;
            }

            if (editingProduct?._id) {
                await inventoryApi.updateItem(editingProduct._id, payload, token);
            } else {
                await inventoryApi.createItem(payload, token);
            }

            await fetchProducts();
            handleCloseModal();
        } catch (error) {
            alert(error.message || 'Failed to save product');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                const token = authStorage.getToken();
                if (!token) {
                    alert('Authentication required. Please login again.');
                    return;
                }
                await inventoryApi.removeItem(id, token);
                await fetchProducts();
            } catch (error) {
                alert(error.message || 'Failed to delete product');
            }
        }
    };

    // Filter
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            header: 'Product Name', accessor: 'name', render: (row) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-white">{row.name}</div>
                    <div className="text-xs text-gray-400">SKU: {row.sku}</div>
                </div>
            )
        },
        {
            header: 'Category', accessor: 'category', render: (row) => (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {row.category}
                </span>
            )
        },
        { header: 'Price', accessor: 'price', render: (row) => `₹${row.price}` },
        {
            header: 'Stock', accessor: 'stock', render: (row) => (
                <div className={row.stock < 10 ? "text-red-500 font-bold flex items-center gap-1" : "text-gray-700 dark:text-gray-300"}>
                    {row.stock < 10 && <AlertTriangle className="w-4 h-4" />}
                    {row.stock}
                </div>
            )
        },
        { header: 'GST', accessor: 'gst', render: (row) => `${row.gst}%` },
    ];

    const categoryOptions = [...new Set((categories || []).map((category) => category.name).filter(Boolean))];

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your products and stock levels</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="air-btn-primary"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            <div className="mb-6 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="air-input pl-10"
                />
            </div>

            <Table
                columns={columns}
                data={filteredProducts}
                actions={(row) => (
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={() => handleOpenModal(row)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(row._id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
            />

            <div className="mt-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Stock Transactions</h2>
                {stockHistory.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No stock transactions yet.</p>
                ) : (
                    <div className="space-y-2">
                        {stockHistory.map((txn) => (
                            <div key={txn._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg text-sm">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{txn.productName}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(txn.timestamp).toLocaleString()} • {txn.reference}</p>
                                </div>
                                <span className={txn.type === 'IN' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                    {txn.type === 'IN' ? '+' : '-'}{txn.quantity}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingProduct ? 'Edit Product' : 'Add New Product'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Wireless Mouse"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">Select Category</option>
                                {categoryOptions.map((categoryName) => (
                                    <option key={categoryName} value={categoryName}>
                                        {categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">SKU</label>
                            <input
                                readOnly
                                type="text"
                                value={formData.sku}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Selling Price</label>
                            <input
                                required
                                type="number"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cost Price</label>
                            <input
                                required
                                type="number"
                                min="0"
                                value={formData.costPrice}
                                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Stock Quantity</label>
                            <input
                                required
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">GST %</label>
                            <select
                                required
                                value={formData.gst}
                                onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="0">0%</option>
                                <option value="5">5%</option>
                                <option value="12">12%</option>
                                <option value="18">18%</option>
                                <option value="28">28%</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                        >
                            {editingProduct ? 'Update Product' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
