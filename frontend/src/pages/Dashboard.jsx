import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';
import { ShoppingCart, Package, Truck, FileText, ChevronDown, X, Info, Lightbulb, MessageSquare } from 'lucide-react';
import { ADMIN_ROLE, MANAGER_ROLE, STAFF_ROLE } from '../utils/roles';

export default function Dashboard() {
    const { user } = useAuth();
    const [showBanner, setShowBanner] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [rightWidgetTab, setRightWidgetTab] = useState('pending');

    const products = storage.getProducts();
    const sales = storage.getSales();
    const purchases = storage.getPurchases();
    const lowStockCount = products.filter((product) => Number(product.stock) < 10).length;

    // Role-based summary for single-organization IMS
    if ([ADMIN_ROLE, MANAGER_ROLE, STAFF_ROLE].includes(user?.role)) {
        const salesRevenue = sales.reduce((acc, sale) => acc + (Number(sale.total) || 0), 0);
        const purchaseSpend = purchases.reduce((acc, purchase) => acc + (Number(purchase.total) || 0), 0);
        const summaryCards = {
            [ADMIN_ROLE]: [
                { label: 'Products', value: products.length, color: 'text-zinc-900' },
                { label: 'Low Stock Alerts', value: lowStockCount, color: 'text-orange-600' },
                { label: 'Sales Revenue', value: `₹${salesRevenue.toFixed(2)}`, color: 'text-airbnb-600' },
                { label: 'Purchase Spend', value: `₹${purchaseSpend.toFixed(2)}`, color: 'text-green-600' }
            ],
            [MANAGER_ROLE]: [
                { label: 'Low Stock Alerts', value: lowStockCount, color: 'text-orange-600' },
                { label: 'Sales Orders', value: sales.length, color: 'text-airbnb-600' },
                { label: 'Purchase Orders', value: purchases.length, color: 'text-purple-600' },
                { label: 'Sales Revenue', value: `₹${salesRevenue.toFixed(2)}`, color: 'text-green-600' }
            ],
            [STAFF_ROLE]: [
                { label: 'Available Products', value: products.length, color: 'text-zinc-900' },
                { label: 'Low Stock Alerts', value: lowStockCount, color: 'text-orange-600' },
                { label: 'Sales Entries', value: sales.length, color: 'text-airbnb-600' },
                { label: 'Purchase Entries', value: purchases.length, color: 'text-green-600' }
            ]
        };

        return (
            <div className="p-6 max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900">Organization Overview</h1>
                    <p className="text-zinc-500">Welcome back, {user?.role}. Here is today’s summary.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {summaryCards[user?.role].map((card) => (
                        <div key={card.label} className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
                            <div className="text-zinc-500 text-sm font-medium mb-1">{card.label}</div>
                            <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 min-h-[300px]">
                        <h3 className="text-lg font-bold text-zinc-900 mb-4">Recent Inventory Activity</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-4 pb-4 border-b border-zinc-100 last:border-0 last:pb-0">
                                    <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center font-bold text-zinc-500">I{i}</div>
                                    <div>
                                        <div className="font-medium text-zinc-800">Inventory update {i}</div>
                                        <div className="text-xs text-zinc-400">Logged 2 hours ago</div>
                                    </div>
                                    <button className="ml-auto text-xs bg-airbnb-50 text-airbnb-700 px-3 py-1 rounded-full font-bold">View</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 min-h-[300px]">
                        <h3 className="text-lg font-bold text-zinc-900 mb-4">System Health</h3>
                        <div className="flex items-center gap-2 text-green-600 font-medium mb-2">
                            <span className="w-2 h-2 rounded-full bg-green-600"></span> All Systems Operational
                        </div>
                        <p className="text-sm text-zinc-500">Server load is normal. Database latency is low.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Standard Dashboard
    const pendingStats = [
        { label: 'To Be Packed', count: 0.00, icon: Package },
        { label: 'To Be Shipped', count: 0.00, icon: Truck },
        { label: 'To Be Delivered', count: 0.00, icon: Truck },
        { label: 'To Be Invoiced', count: 0.00, icon: FileText },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 text-zinc-800">
            {/* Header Section */}
            <div className="flex justify-between items-start">
                <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center border border-zinc-200 text-zinc-400">
                        <BuildingIcon />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2 text-zinc-900">
                            Hello, {user?.name || 'User'}
                        </h1>
                        <p className="text-sm text-zinc-500">{user?.parsedOrg?.orgName || 'My Organization'}</p>
                    </div>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-xs text-zinc-500">FreshInventory Code Helpline: <span className="font-bold text-zinc-700">1800-555-0199</span></p>
                    <p className="text-[10px] text-zinc-400">Mon - Fri • 9:00 AM - 7:00 PM • Toll Free</p>
                </div>
            </div>

            {/* Dashboard Navigation Tabs */}
            <div className="border-b border-zinc-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'dashboard'
                                ? 'border-airbnb-500 text-airbnb-600'
                                : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
                            }`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('getting_started')}
                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'getting_started'
                                ? 'border-airbnb-500 text-airbnb-600'
                                : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
                            }`}
                    >
                        Getting Started
                    </button>
                    <button
                        onClick={() => setActiveTab('recent_updates')}
                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'recent_updates'
                                ? 'border-airbnb-500 text-airbnb-600'
                                : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
                            }`}
                    >
                        Recent Updates
                    </button>
                </nav>
            </div>

            {/* Promotional Banner */}
            {showBanner && (
                <div className="bg-gradient-to-r from-airbnb-50 to-white border border-airbnb-100 rounded-2xl p-6 relative flex flex-col sm:flex-row items-center gap-6 shadow-sm">
                    <button
                        onClick={() => setShowBanner(false)}
                        className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-airbnb-100 shrink-0">
                        <HexagonIcon />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-zinc-900 mb-1">Introducing Fresh Payments!</h3>
                        <p className="text-sm text-zinc-600 max-w-2xl">
                            A unified payments solution built to work effortlessly with your business apps so you can manage payments securely and seamlessly. <a href="#" className="text-airbnb-600 hover:underline">Learn More</a>
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded font-medium">2% per transaction</div>
                        <button className="bg-airbnb-500 hover:bg-airbnb-600 text-white px-6 py-2 rounded-md text-sm font-semibold shadow-sm transition-colors">
                            Set Up Now
                        </button>
                        <a href="#" className="text-xs text-airbnb-600 hover:underline mt-1">View Fees</a>
                    </div>
                </div>
            )}

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (2/3) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Top Selling Items Widget */}
                    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 min-h-[400px]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-zinc-800">Top Selling Items</h2>
                            <button className="text-sm text-zinc-500 flex items-center gap-1 hover:text-airbnb-600">
                                This Month <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Empty State */}
                        <div className="bg-airbnb-50/60 border border-airbnb-100 rounded-lg p-4 flex items-center gap-3 mb-8">
                            <Lightbulb className="w-5 h-5 text-airbnb-500" />
                            <p className="text-sm text-zinc-600">You do not have any top selling items yet.</p>
                        </div>

                        {/* Placeholder Items (Ghost items) */}
                        <div className="grid grid-cols-5 gap-4 opacity-30 pointer-events-none">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <div className="w-full aspect-square bg-zinc-100 rounded-lg"></div>
                                    <div className="h-2 w-16 bg-zinc-100 rounded"></div>
                                    <div className="h-2 w-8 bg-green-50 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Placeholder for stocked items */}
                    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 min-h-[200px]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-zinc-800">Top Stocked Items</h2>
                            <button className="text-sm text-zinc-500 flex items-center gap-1 hover:text-airbnb-600">
                                This Month <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column (1/3) */}
                <div className="space-y-6">

                    {/* Pending Actions / Recent Activities Widget */}
                    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
                        <div className="flex border-b border-zinc-100">
                            <button
                                onClick={() => setRightWidgetTab('pending')}
                                className={`flex-1 py-3 text-sm font-medium transition-colors ${rightWidgetTab === 'pending' ? 'text-zinc-900 border-b-2 border-airbnb-500 bg-zinc-50/50' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                                Pending Actions
                            </button>
                            <button
                                onClick={() => setRightWidgetTab('activities')}
                                className={`flex-1 py-3 text-sm font-medium transition-colors ${rightWidgetTab === 'activities' ? 'text-zinc-900 border-b-2 border-airbnb-500 bg-zinc-50/50' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                                Recent Activities
                            </button>
                        </div>

                        <div className="p-4">
                            {rightWidgetTab === 'pending' ? (
                                <div className="space-y-1">
                                    <div className="mb-4">
                                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                                            <ShoppingCart className="w-4 h-4" /> Sales
                                        </h3>
                                    </div>

                                    {pendingStats.map((stat, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 hover:bg-zinc-50 rounded-lg cursor-pointer group transition-colors">
                                            <span className="text-sm text-zinc-600 group-hover:text-airbnb-600 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-airbnb-500"></span>
                                                {stat.label}
                                            </span>
                                            <span className="text-sm font-medium text-green-600">{stat.count.toFixed(2)}</span>
                                        </div>
                                    ))}

                                    <div className="mt-6 pt-4 border-t border-zinc-100">
                                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                                            <Truck className="w-4 h-4" /> Purchases
                                        </h3>
                                        <div className="flex justify-between items-center p-3 hover:bg-zinc-50 rounded-lg cursor-pointer group transition-colors">
                                            <span className="text-sm text-zinc-600 group-hover:text-airbnb-600 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-airbnb-500"></span>
                                                To Be Received
                                            </span>
                                            <span className="text-sm font-medium text-green-600">0.00</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10 text-zinc-400 text-sm">
                                    No recent activities
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Assistance Pill */}
                    <div className="flex justify-end">
                        <button className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-full shadow-lg border border-gray-100 hover:shadow-xl transition-shadow text-sm font-medium group">
                            <div className="p-1 bg-airbnb-100 rounded-full group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-4 h-4 text-airbnb-600" />
                            </div>
                            Need Assistance?
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Simple Icon Components for specific graphics
function BuildingIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    )
}

function HexagonIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-airbnb-600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
    );
}
