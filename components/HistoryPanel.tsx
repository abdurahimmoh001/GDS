import React from 'react';
import type { HistoryItem } from '../types';
import { HistoryIcon } from './icons/HistoryIcon';
import { PlusIcon } from './icons/PlusIcon';

interface HistoryPanelProps {
    history: HistoryItem[];
    onSelectReport: (item: HistoryItem) => void;
    onStartNew: () => void;
    activeReportId?: string | null;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelectReport, onStartNew, activeReportId }) => {
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 h-full dark:bg-slate-800 dark:border-slate-700 flex flex-col">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="text-blue-600 bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg">
                        <HistoryIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-200">Research History</h2>
                    </div>
                </div>
                <button
                  onClick={onStartNew}
                  className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800 transition-colors"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  New
                </button>
            </div>

            <div className="flex-grow overflow-y-auto -mr-4 pr-3">
                {history.length > 0 ? (
                    <ul role="list" className="divide-y divide-slate-200 dark:divide-slate-700">
                        {history.map((item) => {
                            const isActive = item.id === activeReportId;
                            return (
                                <li key={item.id} className={`relative flex items-center space-x-4 py-4 rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-50 dark:bg-slate-700/50 -mx-4 px-4' : ''}`}>
                                <div className="min-w-0 flex-auto">
                                        <div className="flex items-center gap-x-3">
                                            <h3 className={`text-base leading-6 text-slate-900 dark:text-slate-100 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                                                <button onClick={() => onSelectReport(item)} className="hover:underline focus:outline-none text-left">
                                                    <span className="absolute inset-x-0 -top-px bottom-0" />
                                                    {item.startupName}
                                                </button>
                                            </h3>
                                        </div>
                                        <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                            <p>
                                                {formatDate(item.date)}
                                            </p>
                                        </div>
                                </div>
                                <div className="flex flex-none items-center gap-x-4">
                                    <svg className="h-5 w-5 flex-none text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-slate-500 dark:text-slate-400">No reports generated yet.</p>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Your history will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPanel;
