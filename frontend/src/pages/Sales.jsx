import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Trash2, Plus, Minus, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { inventoryApi, salesApi } from '../services/api';
import { authStorage } from '../services/authStorage';

export default function Sales() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = authStorage.getToken();
                if (!token) {
                    setProducts([]);
                    return;
                }

                const response = await inventoryApi.getItems(token);
                setProducts(response.data || []);
            } catch (error) {
                alert(error.message || 'Failed to load products');
            }
        };

        fetchProducts();
    }, []);

    const addToCart = (product) => {
        if (product.stock <= 0) return;

        setCart(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) {
                if (existing.quantity >= product.stock) return prev; // Check stock limit
                return prev.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item._id === id) {
                const newQty = item.quantity + delta;
                if (newQty <= 0) return null;
                // Check stock
                const product = products.find(p => p._id === id);
                if (newQty > product.stock) return item;
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(Boolean));
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item._id !== id));
    };

    const calculateTotals = () => {
        return cart.reduce((acc, item) => {
            const taxable = item.price * item.quantity; // Assuming price is inclusive, or exclusive? 
            // Let's assume price provided is taxable value to keep it simple, or Selling Price. 
            // If Selling Price (SP) matches requirements, usually GST is on top or included.
            // Requirement: "calculate GST totals". Let's assume Price is base price for simplicity or handle as inclusive.
            // Let's do: Price is Base Price. Tax is extra.

            // Actually usually retail is inclusive. Let's do Price = Base, and Tax is added.
            const gstAmount = (taxable * item.gst) / 100;
            return {
                subtotal: acc.subtotal + taxable,
                tax: acc.tax + gstAmount,
                total: acc.total + taxable + gstAmount
            };
        }, { subtotal: 0, tax: 0, total: 0 });
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        if (!customerName.trim() || customerName.trim().length < 2) {
            alert("Please enter a valid customer name");
            return;
        }
        if (cart.some(item => !Number.isInteger(item.quantity) || item.quantity <= 0)) {
            alert("Cart has invalid item quantities");
            return;
        }
        if (cart.some(item => Number(item.quantity) > Number(products.find(p => p._id === item._id)?.stock || 0))) {
            alert("One or more items exceed available stock");
            return;
        }

        setLoading(true);

        try {
            const token = authStorage.getToken();
            if (!token) {
                alert('Authentication required. Please login again.');
                setLoading(false);
                return;
            }

            const result = await salesApi.checkout(
                {
                    customerName: customerName.trim(),
                    items: cart.map((item) => ({
                        _id: item._id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        gst: item.gst
                    }))
                },
                token
            );

            setLoading(false);
            setCart([]);
            setCustomerName('');

            const productsResponse = await inventoryApi.getItems(token);
            setProducts(productsResponse.data || []);

            alert(`Sale successful! Invoice: ${result.data.invoiceId}`);
        } catch (error) {
            setLoading(false);
            alert(error.message || 'Checkout failed');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) && p.stock > 0
    );

    const totals = calculateTotals();

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] lg:flex-row gap-6">
            {/* Product List */}
            <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="air-input pl-10"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 gap-4 content-start">
                    {filteredProducts.map(product => (
                        <div
                            key={product._id}
                            onClick={() => addToCart(product)}
                            className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl cursor-pointer hover:ring-2 hover:ring-airbnb-500 transition-all border border-transparent hover:bg-white dark:hover:bg-gray-700"
                        >
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{product.name}</h3>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-airbnb-600 dark:text-airbnb-400 font-bold">₹{product.price}</span>
                                <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-gray-600 dark:text-gray-300">
                                    {product.stock} left
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cart Side */}
            <div className="w-full lg:w-96 flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                        <ShoppingCart className="w-5 h-5" /> Current Sale
                    </h2>
                    <input
                        type="text"
                        placeholder="Customer Name / Phone"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="mt-4 air-input"
                    />
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <p>Cart is empty</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                <div className="flex-1 min-w-0 mr-4">
                                    <h4 className="font-medium text-gray-900 dark:text-white truncate">{item.name}</h4>
                                    <p className="text-xs text-gray-500">₹{item.price} x {item.quantity}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 bg-white dark:bg-gray-600 rounded-lg shadow-sm border border-gray-200 dark:border-gray-500">
                                        <button onClick={() => updateQuantity(item._id, -1)} className="p-1 hover:text-airbnb-600"><Minus className="w-4 h-4" /></button>
                                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item._id, 1)} className="p-1 hover:text-airbnb-600"><Plus className="w-4 h-4" /></button>
                                    </div>
                                    <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Subtotal</span>
                            <span>₹{totals.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>GST (Total)</span>
                            <span>₹{totals.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span>Total</span>
                            <span>₹{totals.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || loading}
                        className="w-full py-3 bg-airbnb-500 hover:bg-airbnb-600 text-white rounded-xl font-bold text-lg shadow-air transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? 'Processing...' : (
                            <>
                                <Receipt className="w-5 h-5" /> Checkout
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
