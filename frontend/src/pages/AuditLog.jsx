import { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import Table from '../components/Table';
import { History } from 'lucide-react';

export default function AuditLog() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        setLogs(storage.getAuditLogs());
    }, []);

    const columns = [
        { header: 'Time', accessor: 'timestamp', render: row => new Date(row.timestamp).toLocaleString() },
        { header: 'Action', accessor: 'action', render: row => <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{row.action}</span> },
        { header: 'Details', accessor: 'details' },
        { header: 'User', accessor: 'user' }
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <History className="w-6 h-6" /> System Audit Log
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Track recent system activities</p>

            <Table columns={columns} data={logs} />
        </div>
    );
}
