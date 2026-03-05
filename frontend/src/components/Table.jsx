import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Table({ columns, data, actions, onRowClick }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-zinc-200 dark:border-gray-700 overflow-hidden shadow-sm transition-colors">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-600 dark:text-gray-300">
                    <thead className="bg-zinc-50 dark:bg-gray-700/50 text-xs uppercase text-zinc-600 dark:text-gray-300 font-semibold border-b border-zinc-200 dark:border-gray-700">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-6 py-4">{col.header}</th>
                            ))}
                            {actions && <th className="px-6 py-4 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-gray-700">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center text-zinc-400 dark:text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            data.map((row, idx) => (
                                <tr
                                    key={idx}
                                    onClick={() => onRowClick && onRowClick(row)}
                                    className={clsx(
                                        "hover:bg-zinc-50 dark:hover:bg-gray-700/50 transition-colors",
                                        onRowClick && "cursor-pointer"
                                    )}
                                >
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                                            {col.render ? col.render(row) : row[col.accessor]}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            {actions(row)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Simple pagination placeholder */}
            <div className="px-6 py-4 border-t border-zinc-200 dark:border-gray-700 flex justify-between items-center bg-zinc-50 dark:bg-gray-800/50">
                <span className="text-xs text-zinc-500 dark:text-gray-400">Showing {data.length} entries</span>
                <div className="flex gap-2">
                    <button disabled className="p-1 rounded-lg bg-white dark:bg-gray-700 border border-zinc-200 dark:border-gray-600 disabled:opacity-50">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button disabled className="p-1 rounded-lg bg-white dark:bg-gray-700 border border-zinc-200 dark:border-gray-600 disabled:opacity-50">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
