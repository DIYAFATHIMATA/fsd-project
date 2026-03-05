import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import { Search, Bell } from 'lucide-react';

export default function DashboardLayout() {
    return (
        <div className="flex min-h-screen bg-stone-100 dark:bg-gray-900 transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white/95 dark:bg-gray-800/95 backdrop-blur border-b border-zinc-200 dark:border-gray-700 h-16 flex items-center justify-between px-6 sticky top-0 z-10 transition-colors duration-300">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-gray-200">
                        Overview
                    </h2>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="air-input pl-9 py-2.5 w-64 bg-zinc-50 dark:bg-gray-700"
                            />
                        </div>
                        <button className="p-2 text-zinc-500 dark:text-gray-400 hover:bg-zinc-100 dark:hover:bg-gray-700 rounded-xl relative transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                        </button>
                        <div className="w-px h-8 bg-zinc-200 dark:bg-gray-700 mx-1"></div>
                        <ThemeToggle />
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-8 overflow-y-auto overflow-x-hidden scrollbar-thin">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
