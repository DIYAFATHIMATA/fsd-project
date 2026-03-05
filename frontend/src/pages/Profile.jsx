import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield } from 'lucide-react';

export default function Profile() {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Manage your account settings</p>

            <div className="max-w-2xl bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400 capitalize">{user?.role?.replace('_', ' ')}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-gray-500">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Full Name</p>
                            <p className="text-gray-900 dark:text-white font-medium">{user?.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-gray-500">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Email Address</p>
                            <p className="text-gray-900 dark:text-white font-medium">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-gray-500">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Role & Permissions</p>
                            <p className="text-gray-900 dark:text-white font-medium capitalize">{user?.role?.replace('_', ' ')}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
}
