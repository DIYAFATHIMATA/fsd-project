import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import Items from './pages/inventory/Items';
import InventoryAdjustments from './pages/inventory/InventoryAdjustments';
import Packages from './pages/inventory/Packages';
import Shipments from './pages/inventory/Shipments';
import Customers from './pages/sales/Customers';
import SalesOrders from './pages/sales/SalesOrders';
import Invoices from './pages/sales/Invoices';
import DeliveryChallans from './pages/sales/DeliveryChallans';
import PaymentsReceived from './pages/sales/PaymentsReceived';
import SalesReturns from './pages/sales/SalesReturns';
import CreditNotes from './pages/sales/CreditNotes';
import Vendors from './pages/purchases/Vendors';
import Expenses from './pages/purchases/Expenses';
import PurchaseOrders from './pages/purchases/PurchaseOrders';
import PurchaseReceives from './pages/purchases/PurchaseReceives';
import Bills from './pages/purchases/Bills';
import PaymentsMade from './pages/purchases/PaymentsMade';
import VendorCredits from './pages/purchases/VendorCredits';
import { ADMIN_ROLE, MANAGER_ROLE, STAFF_ROLE, isAllowedRole } from './utils/roles';

// Protected Route Component
const ProtectedRoute = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    return <Outlet />;
};

const RoleRoute = ({ allowedRoles }) => {
    const { user } = useAuth();
    if (!isAllowedRole(user, allowedRoles)) return <Navigate to="/dashboard" replace />;
    return <Outlet />;
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />

                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<DashboardLayout />}>
                            {/* Dashboard is no longer the default root, but accessible via /dashboard */}
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/products" element={<Navigate to="/inventory/items" replace />} />

                            <Route element={<RoleRoute allowedRoles={[ADMIN_ROLE, MANAGER_ROLE, STAFF_ROLE]} />}>
                                <Route path="/inventory/items" element={<Items />} />
                                <Route path="/sales/orders" element={<SalesOrders />} />
                                <Route path="/purchases/orders" element={<PurchaseOrders />} />
                                <Route path="/purchases/vendors" element={<Vendors />} />
                                <Route path="/suppliers" element={<Navigate to="/purchases/vendors" replace />} />
                                <Route path="/profile" element={<Profile />} />
                            </Route>

                            <Route element={<RoleRoute allowedRoles={[ADMIN_ROLE, MANAGER_ROLE]} />}>
                                <Route path="/inventory/adjustments" element={<InventoryAdjustments />} />
                                <Route path="/inventory/packages" element={<Packages />} />
                                <Route path="/inventory/shipments" element={<Shipments />} />
                                <Route path="/orders" element={<Navigate to="/sales/orders" replace />} />
                                <Route path="/sales/customers" element={<Customers />} />
                                <Route path="/sales/invoices" element={<Invoices />} />
                                <Route path="/sales/delivery-challans" element={<DeliveryChallans />} />
                                <Route path="/sales/payments-received" element={<PaymentsReceived />} />
                                <Route path="/sales/returns" element={<SalesReturns />} />
                                <Route path="/sales/credit-notes" element={<CreditNotes />} />
                                <Route path="/purchases/expenses" element={<Expenses />} />
                                <Route path="/purchases/receives" element={<PurchaseReceives />} />
                                <Route path="/purchases/bills" element={<Bills />} />
                                <Route path="/purchases/payments" element={<PaymentsMade />} />
                                <Route path="/purchases/vendor-credits" element={<VendorCredits />} />
                            </Route>

                            <Route element={<RoleRoute allowedRoles={[ADMIN_ROLE]} />}>
                                <Route path="/categories" element={<Categories />} />
                                <Route path="/users" element={<Users />} />
                                <Route path="/reports" element={<Reports />} />
                            </Route>

                            {/* Catch all */}
                            <Route path="*" element={<Navigate to="/login" replace />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
