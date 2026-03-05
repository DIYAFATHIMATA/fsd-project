import { Outlet } from 'react-router-dom';
import { Package } from 'lucide-react';

const AuthLayout = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-stone-50 px-4 py-10">
            <div className="w-full max-w-md p-8 air-card">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-airbnb-500 rounded-2xl shadow-air-lg">
                        <Package className="w-8 h-8 text-white" />
                    </div>
                </div>
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-zinc-900">IMS</h1>
                    <p className="text-zinc-500 text-sm mt-1">Inventory Management System</p>
                </div>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
