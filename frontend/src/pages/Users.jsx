import { useState, useEffect } from 'react';
import { UserPlus, Trash2, Edit } from 'lucide-react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { usersApi } from '../services/api';
import { authStorage } from '../services/authStorage';
import { useAuth } from '../context/AuthContext';
import { ADMIN_ROLE, MANAGER_ROLE, STAFF_ROLE, hasAdminAccess } from '../utils/roles';

export default function Users() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: STAFF_ROLE, phone: '' });

    const getTokenOrThrow = () => {
        const token = authStorage.getToken();
        if (!token) {
            throw new Error('Authentication required. Please login again.');
        }
        return token;
    };

    const fetchUsers = async () => {
        try {
            const token = getTokenOrThrow();
            const response = await usersApi.getAll(token);
            setUsers(response.data || []);
        } catch (error) {
            alert(error.message || 'Failed to load users');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({ ...user, password: '' }); // Don't show password
        } else {
            setEditingUser(null);
            setFormData({ name: '', email: '', password: '', role: STAFF_ROLE, phone: '' });
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (id === currentUser?._id) return alert("Cannot delete yourself");
        if (confirm("Delete this user?")) {
            try {
                const token = getTokenOrThrow();
                await usersApi.remove(id, token);
                fetchUsers();
            } catch (error) {
                alert(error.message || 'Failed to delete user');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = formData.email.trim();
        const name = formData.name.trim();
        const phone = formData.phone.trim();
        const validPhone = !phone || /^[0-9+()\-\s]{7,15}$/.test(phone);

        if (name.length < 2) {
            alert('Name must be at least 2 characters');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Please enter a valid email');
            return;
        }
        if (!validPhone) {
            alert('Please enter a valid phone number');
            return;
        }

        const payload = { ...formData, name, email, phone };
        if (editingUser) {
            if (!payload.password) delete payload.password; // Don't overwrite if empty
        } else if ((payload.password || '').length < 4) {
            alert('Password must be at least 4 characters');
            return;
        }

        try {
            const token = getTokenOrThrow();
            if (editingUser?._id) {
                await usersApi.update(editingUser._id, payload, token);
            } else {
                await usersApi.create(payload, token);
            }
            await fetchUsers();
            setIsModalOpen(false);
        } catch (error) {
            alert(error.message || 'Failed to save user');
        }
    };

    const columns = [
        {
            header: 'Name', accessor: 'name', render: (row) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                        {(row.name || '?')[0]}
                    </div>
                    <div>
                        <div className="font-medium text-gray-900 dark:text-white">{row.name}</div>
                        <div className="text-xs text-gray-400">{row.email}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Role', accessor: 'role', render: (row) => (
                <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize 
            ${row.role === 'admin' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                    {row.role.replace('_', ' ')}
                </span>
            )
        },
        { header: 'Phone', accessor: 'phone', render: row => row.phone || '-' }
    ];

    if (!hasAdminAccess(currentUser)) {
        return <div className="p-8 text-center text-red-500 font-bold">Access Denied: You do not have permission to view this page.</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Users
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Manage Admin, Manager and Staff accounts.
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                    <UserPlus className="w-4 h-4" />
                    Add User
                </button>
            </div>

            <Table
                columns={columns}
                data={users}
                actions={(row) => (
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={() => handleOpenModal(row)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        {row._id !== currentUser?._id && (
                            <button
                                onClick={() => handleDelete(row._id)}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'Edit User' : 'Add New User'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        required
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        required
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={ADMIN_ROLE}>Admin</option>
                            <option value={MANAGER_ROLE}>Manager</option>
                            <option value={STAFF_ROLE}>Staff</option>
                        </select>
                    </div>
                    <input
                        type="password"
                        placeholder={editingUser ? "Leave blank to keep current password" : "Password"}
                        required={!editingUser}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        {editingUser ? 'Update User' : 'Create User'}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
