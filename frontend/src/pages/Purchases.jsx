import { useState, useEffect } from 'react';
import { Plus, UserPlus } from 'lucide-react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { authStorage } from '../services/authStorage';
import { inventoryApi, purchasesApi, resourceApi } from '../services/api';

export default function Purchases() {
    const [activeTab, setActiveTab] = useState('purchases'); // purchases, suppliers
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [purchases, setPurchases] = useState([]);

    // Modals
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

    // Forms
    const [supplierForm, setSupplierForm] = useState({ name: '', contact: '', gst: '' });
    const [purchaseForm, setPurchaseForm] = useState({ supplierId: '', items: [] });
    // Temp item for purchase
    const [tempItem, setTempItem] = useState({ productId: '', quantity: '', costPrice: '' });

    const fetchData = async () => {
        try {
            const token = authStorage.getToken();
            if (!token) {
                setSuppliers([]);
                setProducts([]);
                setPurchases([]);
                return;
            }

            const [suppliersResponse, productsResponse, purchasesResponse] = await Promise.all([
                resourceApi.getAll('ims_suppliers', token),
                inventoryApi.getItems(token),
                resourceApi.getAll('ims_purchases', token)
            ]);

            setSuppliers(suppliersResponse.data || []);
            setProducts(productsResponse.data || []);
            setPurchases(purchasesResponse.data || []);
        } catch (error) {
            alert(error.message || 'Failed to load purchase data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const calculatePurchaseTotals = (items) => {
        return items.reduce((acc, item) => {
            const qty = Number(item.quantity) || 0;
            const cost = Number(item.costPrice) || 0;
            const gstRate = Number(item.gst) || 0;
            const taxable = qty * cost;
            const tax = (taxable * gstRate) / 100;
            return {
                subtotal: acc.subtotal + taxable,
                tax: acc.tax + tax,
                total: acc.total + taxable + tax
            };
        }, { subtotal: 0, tax: 0, total: 0 });
    };

    const handleSaveSupplier = async (e) => {
        e.preventDefault();
        const name = supplierForm.name.trim();
        const contact = supplierForm.contact.trim();
        const gst = supplierForm.gst.trim();
        if (name.length < 2) return alert('Supplier name must be at least 2 characters');
        if (!/^[0-9+()\-\s]{7,15}$/.test(contact)) return alert('Please enter a valid contact number');
        if (gst && gst.length < 5) return alert('Please enter a valid GSTIN');

        try {
            const token = authStorage.getToken();
            if (!token) {
                alert('Authentication required. Please login again.');
                return;
            }

            await resourceApi.create('ims_suppliers', supplierForm, token);
            await fetchData();
            setIsSupplierModalOpen(false);
            setSupplierForm({ name: '', contact: '', gst: '' });
        } catch (error) {
            alert(error.message || 'Failed to save supplier');
        }
    };

    const addItemToPurchase = () => {
        if (!tempItem.productId || !tempItem.quantity) return;
        const quantity = Number(tempItem.quantity);
        if (!Number.isFinite(quantity) || quantity <= 0) {
            alert('Quantity must be greater than 0');
            return;
        }
        const product = products.find(p => p._id === tempItem.productId);
        if (!product) return;

        const costPrice = Number(tempItem.costPrice) || Number(product.costPrice) || 0;
        if (costPrice < 0) {
            alert('Cost cannot be negative');
            return;
        }

        setPurchaseForm(prev => ({
            ...prev,
            items: [...prev.items, { ...product, quantity, costPrice, gst: Number(product.gst) || 0 }]
        }));
        setTempItem({ productId: '', quantity: '', costPrice: '' });
    };

    const handleSavePurchase = async () => {
        if (!purchaseForm.supplierId || purchaseForm.items.length === 0) return;
        const hasInvalid = purchaseForm.items.some((item) => !Number.isFinite(Number(item.quantity)) || Number(item.quantity) <= 0);
        if (hasInvalid) {
            alert('Please fix invalid item quantities');
            return;
        }

        try {
            const token = authStorage.getToken();
            if (!token) {
                alert('Authentication required. Please login again.');
                return;
            }

            await purchasesApi.record({
                supplierId: purchaseForm.supplierId,
                items: purchaseForm.items.map((item) => ({
                    _id: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    costPrice: item.costPrice,
                    gst: item.gst
                }))
            }, token);

            await fetchData();
            setIsPurchaseModalOpen(false);
            setPurchaseForm({ supplierId: '', items: [] });
        } catch (error) {
            alert(error.message || 'Failed to record purchase');
        }
    };

    const supplierColumns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Contact', accessor: 'contact' },
        { header: 'GSTIN', accessor: 'gst' },
    ];

    const purchaseColumns = [
        { header: 'Date', accessor: 'date', render: row => new Date(row.date).toLocaleDateString() },
        { header: 'Supplier', accessor: 'supplierId', render: row => suppliers.find(s => s._id === row.supplierId)?.name || row.supplierName || 'Unknown' },
        { header: 'Items', accessor: 'items', render: row => row.items.length },
        { header: 'Total Qty', accessor: 'total', render: row => row.items.reduce((acc, item) => acc + item.quantity, 0) },
        { header: 'GST', accessor: 'tax', render: row => `₹${Number(row.tax || 0).toFixed(2)}` },
        { header: 'Total', accessor: 'grandTotal', render: row => `₹${Number(row.total || 0).toFixed(2)}` },
    ];

    const purchaseTotals = calculatePurchaseTotals(purchaseForm.items);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Procurement</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage suppliers and stock purchases</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsSupplierModalOpen(true)}
                        className="air-btn-secondary"
                    >
                        <UserPlus className="w-4 h-4" /> Add Supplier
                    </button>
                    <button
                        onClick={() => setIsPurchaseModalOpen(true)}
                        className="air-btn-primary"
                    >
                        <Plus className="w-4 h-4" /> New Purchase
                    </button>
                </div>
            </div>

            <div className="flex gap-4 mb-6 border-b border-zinc-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('purchases')}
                    className={`pb-3 px-1 font-medium text-sm transition-colors relative ${activeTab === 'purchases' ? 'text-airbnb-600 dark:text-airbnb-400' : 'text-zinc-500'}`}
                >
                    Purchase History
                    {activeTab === 'purchases' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-airbnb-600 dark:bg-airbnb-400 rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('suppliers')}
                    className={`pb-3 px-1 font-medium text-sm transition-colors relative ${activeTab === 'suppliers' ? 'text-airbnb-600 dark:text-airbnb-400' : 'text-zinc-500'}`}
                >
                    Suppliers
                    {activeTab === 'suppliers' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-airbnb-600 dark:bg-airbnb-400 rounded-t-full"></div>}
                </button>
            </div>

            {activeTab === 'purchases' ? (
                <Table columns={purchaseColumns} data={purchases} />
            ) : (
                <Table columns={supplierColumns} data={suppliers} />
            )}

            {/* Supplier Modal */}
            <Modal isOpen={isSupplierModalOpen} onClose={() => setIsSupplierModalOpen(false)} title="Add Supplier">
                <form onSubmit={handleSaveSupplier} className="space-y-4">
                    <input
                        required
                        placeholder="Supplier Name"
                        value={supplierForm.name}
                        onChange={e => setSupplierForm({ ...supplierForm, name: e.target.value })}
                        className="air-input"
                    />
                    <input
                        required
                        placeholder="Contact Number"
                        value={supplierForm.contact}
                        onChange={e => setSupplierForm({ ...supplierForm, contact: e.target.value })}
                        className="air-input"
                    />
                    <input
                        required
                        placeholder="GSTIN"
                        value={supplierForm.gst}
                        onChange={e => setSupplierForm({ ...supplierForm, gst: e.target.value })}
                        className="air-input"
                    />
                    <button className="air-btn-primary w-full">Save Supplier</button>
                </form>
            </Modal>

            {/* Purchase Modal */}
            <Modal isOpen={isPurchaseModalOpen} onClose={() => setIsPurchaseModalOpen(false)} title="Record Purchase">
                <div className="space-y-4">
                    <select
                        value={purchaseForm.supplierId}
                        onChange={e => setPurchaseForm({ ...purchaseForm, supplierId: e.target.value })}
                        className="air-input"
                    >
                        <option value="">Select Supplier</option>
                        {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg space-y-3">
                        <h4 className="text-sm font-semibold">Add Items</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <select
                                value={tempItem.productId}
                                onChange={e => setTempItem({ ...tempItem, productId: e.target.value })}
                                className="col-span-2 air-input"
                            >
                                <option value="">Select Product</option>
                                {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                            </select>
                            <input
                                type="number"
                                placeholder="Qty"
                                value={tempItem.quantity}
                                onChange={e => setTempItem({ ...tempItem, quantity: e.target.value })}
                                className="air-input"
                            />
                            <input
                                type="number"
                                placeholder="Cost"
                                value={tempItem.costPrice}
                                onChange={e => setTempItem({ ...tempItem, costPrice: e.target.value })}
                                className="air-input"
                            />
                        </div>
                        <button onClick={addItemToPurchase} className="w-full py-1.5 bg-zinc-200 dark:bg-gray-600 text-zinc-800 dark:text-white rounded-lg text-sm hover:bg-zinc-300 dark:hover:bg-gray-500">Add to List</button>
                    </div>

                    {/* List */}
                    <div className="max-h-32 overflow-y-auto space-y-1">
                        {purchaseForm.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                <span>{item.name}</span>
                                <span>x{item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    <div className="text-sm bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3 space-y-1">
                        <div className="flex justify-between"><span>Subtotal</span><span>₹{purchaseTotals.subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>GST</span><span>₹{purchaseTotals.tax.toFixed(2)}</span></div>
                        <div className="flex justify-between font-semibold"><span>Total</span><span>₹{purchaseTotals.total.toFixed(2)}</span></div>
                    </div>

                    <button
                        onClick={handleSavePurchase}
                        disabled={!purchaseForm.supplierId || purchaseForm.items.length === 0}
                        className="air-btn-primary w-full disabled:opacity-50"
                    >
                        Complete Purchase
                    </button>
                </div>
            </Modal>
        </div>
    );
}
