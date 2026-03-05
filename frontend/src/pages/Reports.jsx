import { useState, useEffect } from 'react';
import { BarChart, PieChart } from 'lucide-react';
import { reportsApi } from '../services/api';
import { authStorage } from '../services/authStorage';

export default function Reports() {
    const [summary, setSummary] = useState({
        totalSalesRevenue: 0,
        totalPurchaseCost: 0,
        totalGstCollected: 0,
        totalGstPaid: 0,
        netGst: 0,
        invoiceCount: 0,
        purchaseOrderCount: 0,
        productsCount: 0,
        customersCount: 0,
        lowStockCount: 0,
        monthlySalesTrend: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReportSummary = async () => {
            try {
                const token = authStorage.getToken();
                if (!token) {
                    setSummary({
                        totalSalesRevenue: 0,
                        totalPurchaseCost: 0,
                        totalGstCollected: 0,
                        totalGstPaid: 0,
                        netGst: 0,
                        invoiceCount: 0,
                        purchaseOrderCount: 0,
                        productsCount: 0,
                        customersCount: 0,
                        lowStockCount: 0,
                        monthlySalesTrend: []
                    });
                    return;
                }

                const response = await reportsApi.getSummary(token);
                setSummary(response.data || {});
            } catch (error) {
                alert(error.message || 'Failed to load reports summary');
            } finally {
                setIsLoading(false);
            }
        };

        fetchReportSummary();
    }, []);

    const totalSales = Number(summary.totalSalesRevenue || 0);
    const totalPurchases = Number(summary.totalPurchaseCost || 0);
    const totalTaxCollected = Number(summary.totalGstCollected || 0);
    const totalTaxPaid = Number(summary.totalGstPaid || 0);

    const chartData = summary.monthlySalesTrend || [];

    const maxValue = chartData.length > 0 ? Math.max(...chartData.map(d => Number(d.value || 0)), 1) : 1;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reports & Analytics</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Financial overview and tax reports</p>

            {isLoading && (
                <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">Loading overall summary...</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sales Revenue</h3>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">₹{totalSales.toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Purchase Cost</h3>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">₹{totalPurchases.toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total GST Collected</h3>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">₹{totalTaxCollected.toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Invoices</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{summary.invoiceCount || 0}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Purchase Orders</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{summary.purchaseOrderCount || 0}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Products</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{summary.productsCount || 0}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Customers</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{summary.customersCount || 0}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Low Stock Items</p>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">{summary.lowStockCount || 0}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <BarChart className="w-5 h-5 text-gray-400" /> Monthly Sales Trend
                    </h3>
                    <div className="flex items-end justify-between h-48 gap-4">
                        {chartData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-lg relative overflow-hidden h-full flex items-end">
                                    <div
                                        style={{ height: `${(Number(d.value || 0) / maxValue) * 100}%` }}
                                        className="w-full bg-blue-500 dark:bg-blue-600 opacity-80 group-hover:opacity-100 transition-all duration-500 rounded-t-lg"
                                    ></div>
                                </div>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{d.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* GST Summary */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-gray-400" /> GST Tax Breakdown
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <span className="text-gray-600 dark:text-gray-300">CGST (50%)</span>
                            <span className="font-bold text-gray-900 dark:text-white">₹{(totalTaxCollected / 2).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <span className="text-gray-600 dark:text-gray-300">SGST (50%)</span>
                            <span className="font-bold text-gray-900 dark:text-white">₹{(totalTaxCollected / 2).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                            <span className="text-blue-700 dark:text-blue-300 font-medium">Net GST (Collected - Paid)</span>
                            <span className="font-bold text-blue-700 dark:text-blue-300">₹{Number(summary.netGst || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
