import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Truck,
    FileBarChart,
    Users,
    Settings,
    LogOut,
    Receipt,
    ChevronDown,
    ChevronRight,
    CreditCard,
    FileText,
    Undo2,
    UserCircle,
    ClipboardList,
    Box,
    ShoppingBag,
    Archive
} from 'lucide-react';
import clsx from 'clsx';
import { ADMIN_ROLE, MANAGER_ROLE, STAFF_ROLE } from '../utils/roles';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    // State for expanded nested menus
    const [expandedMenus, setExpandedMenus] = useState(['Sales']); // Default open Sales for visibility

    const toggleMenu = (name) => {
        setExpandedMenus(prev =>
            prev.includes(name)
                ? prev.filter(item => item !== name)
                : [...prev, name]
        );
    };

    const ALL_ROLES = [ADMIN_ROLE, MANAGER_ROLE, STAFF_ROLE];
    const ADMIN_MANAGER = [ADMIN_ROLE, MANAGER_ROLE];
    const STAFF_OPERATIONS = [ADMIN_ROLE, MANAGER_ROLE, STAFF_ROLE];

    const links = [
        { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, roles: ALL_ROLES },

        // Inventory Group
        {
            name: 'Inventory',
            icon: Package,
            roles: STAFF_OPERATIONS,
            children: [
                { name: 'Items', to: '/inventory/items', icon: Package, roles: STAFF_OPERATIONS },
                { name: 'Inventory Adjustments', to: '/inventory/adjustments', icon: ClipboardList, roles: ADMIN_MANAGER },
                { name: 'Packages', to: '/inventory/packages', icon: Box, roles: ADMIN_MANAGER },
                { name: 'Shipments', to: '/inventory/shipments', icon: Truck, roles: ADMIN_MANAGER },
            ]
        },

        // Sales Group (Already implemented)
        {
            name: 'Sales',
            icon: ShoppingCart,
            roles: STAFF_OPERATIONS,
            children: [
                { name: 'Customers', to: '/sales/customers', icon: UserCircle, roles: ADMIN_MANAGER },
                { name: 'Sales Orders', to: '/sales/orders', icon: ClipboardList, roles: STAFF_OPERATIONS },
                { name: 'Invoices', to: '/sales/invoices', icon: FileText, roles: ADMIN_MANAGER },
                { name: 'Delivery Challans', to: '/sales/delivery-challans', icon: Truck, roles: ADMIN_MANAGER },
                { name: 'Payments Received', to: '/sales/payments-received', icon: CreditCard, roles: ADMIN_MANAGER },
                { name: 'Sales Returns', to: '/sales/returns', icon: Undo2, roles: ADMIN_MANAGER },
                { name: 'Credit Notes', to: '/sales/credit-notes', icon: FileText, roles: ADMIN_MANAGER },
            ]
        },

        // Purchases Group
        {
            name: 'Purchases',
            icon: ShoppingBag,
            roles: STAFF_OPERATIONS,
            children: [
                { name: 'Vendors', to: '/purchases/vendors', icon: Users, roles: STAFF_OPERATIONS },
                { name: 'Expenses', to: '/purchases/expenses', icon: Receipt, roles: ADMIN_MANAGER },
                { name: 'Purchase Orders', to: '/purchases/orders', icon: FileText, roles: STAFF_OPERATIONS },
                { name: 'Purchase Receives', to: '/purchases/receives', icon: Archive, roles: ADMIN_MANAGER },
                { name: 'Bills', to: '/purchases/bills', icon: FileText, roles: ADMIN_MANAGER },
                { name: 'Payments Made', to: '/purchases/payments', icon: CreditCard, roles: ADMIN_MANAGER },
                { name: 'Vendor Credits', to: '/purchases/vendor-credits', icon: FileText, roles: ADMIN_MANAGER },
            ]
        },

        { name: 'Categories', to: '/categories', icon: LayoutDashboard, roles: [ADMIN_ROLE] },

        { name: 'Reports', to: '/reports', icon: FileBarChart, roles: [ADMIN_ROLE] },

        { name: 'Users', to: '/users', icon: Users, roles: [ADMIN_ROLE] },
        { name: 'Profile', to: '/profile', icon: Settings, roles: ALL_ROLES },
    ];

    const filteredLinks = links.filter(link => !link.roles || link.roles.includes(user?.role));

    const renderLink = (link) => {
        // Parent Link with Children
        if (link.children) {
            // Filter children based on roles
            const visibleChildren = link.children.filter(child =>
                !child.roles || child.roles.includes(user?.role)
            );

            if (visibleChildren.length === 0) return null;

            const isExpanded = expandedMenus.includes(link.name);
            const isActiveParent = visibleChildren.some(child => location.pathname === child.to);

            return (
                <div key={link.name} className="space-y-1">
                    <button
                        onClick={() => toggleMenu(link.name)}
                        className={clsx(
                            "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                            isActiveParent || isExpanded
                                ? "bg-airbnb-50 text-airbnb-700 dark:text-airbnb-400"
                                : "text-zinc-600 dark:text-gray-400 hover:bg-zinc-50 dark:hover:bg-gray-700/50"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <link.icon className={clsx("w-5 h-5", isActiveParent ? "text-airbnb-600" : "text-zinc-500")} />
                            <span className="font-medium">{link.name}</span>
                        </div>
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />}
                    </button>

                    {/* Children Links */}
                    {isExpanded && (
                        <div className="pl-4 space-y-1">
                            {visibleChildren.map(child => (
                                <NavLink
                                    key={child.to}
                                    to={child.to}
                                    className={({ isActive }) => clsx(
                                        "flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 border-l-2 ml-4",
                                        isActive
                                            ? "border-airbnb-500 bg-airbnb-50 text-airbnb-700 font-medium"
                                            : "border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                                    )}
                                >
                                    {/* <child.icon className="w-4 h-4" /> Optional: Hide child icons for cleaner look if preferred */}
                                    <span>{child.name}</span>
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // Standard Link
        return (
            <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive
                        ? "bg-airbnb-50 dark:bg-airbnb-700/20 text-airbnb-700 dark:text-airbnb-400 font-semibold shadow-sm"
                        : "text-zinc-600 dark:text-gray-400 hover:bg-zinc-50 dark:hover:bg-gray-700/50 hover:text-zinc-900 dark:hover:text-gray-200"
                )}
            >
                <link.icon className="w-5 h-5" />
                <span>{link.name}</span>
            </NavLink>
        );
    };

    return (
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-zinc-200 dark:border-gray-700 h-screen sticky top-0 flex flex-col transition-colors duration-300">
            <div className="p-6 flex items-center gap-3">
                <div className="p-2 bg-airbnb-500 rounded-xl shadow-air">
                    <Receipt className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-white">IMS</h1>
                    <span className="text-xs text-airbnb-600 dark:text-airbnb-400 font-medium">Inventory System</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {filteredLinks.map(link => renderLink(link))}
            </nav>

            <div className="p-4 border-t border-zinc-200 dark:border-gray-700">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
                <div className="mt-4 px-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-zinc-600 dark:text-gray-300">
                        {user?.name?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-xs text-zinc-500 dark:text-gray-400 capitalize">{user?.role?.replace('_', ' ')}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
