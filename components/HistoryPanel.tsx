import React, { useState } from 'react';
import type { HistoryItem } from '../types';
import { HistoryIcon } from './icons/HistoryIcon';
import { PlusIcon } from './icons/PlusIcon';
import { XIcon } from './icons/XIcon';
import { UserIcon } from './icons/UserIcon';

interface HistoryPanelProps {
    history: HistoryItem[];
    onSelectReport: (item: HistoryItem) => void;
    onStartNew: () => void;
    activeReportId?: string | null;
    onClose?: () => void;
    profiles: string[];
    currentProfile: string;
    onSwitchProfile: (profile: string) => void;
    onCreateProfile: (profile: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ 
    history, 
    onSelectReport, 
    onStartNew, 
    activeReportId, 
    onClose,
    profiles,
    currentProfile,
    onSwitchProfile,
    onCreateProfile
}) => {
    const [isAddingProfile, setIsAddingProfile] = useState(false);
    const [newProfileName, setNewProfileName] = useState('');
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    const handleAddProfile = (e: React.FormEvent) => {
        e.preventDefault();
        if (newProfileName.trim()) {
            onCreateProfile(newProfileName.trim());
            setNewProfileName('');
            setIsAddingProfile(false);
        }
    };

    const wrapperClasses = onClose 
      ? 'h-full flex flex-col p-6' // Mobile panel styles
      : 'bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 h-full dark:bg-slate-900 dark:border-slate-800 dark:shadow-none flex flex-col transition-all duration-300'; // Desktop card styles

    return (
        <div className={wrapperClasses}>
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="text-amber-600 bg-amber-100 dark:bg-amber-900/20 p-2 rounded-lg">
                        <HistoryIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-slate-200">History</h2>
                    </div>
                </div>
                <div className="flex items-center">
                    <button
                      onClick={onStartNew}
                      className="flex items-center justify-center p-2 rounded-lg text-amber-600 bg-amber-50 hover:bg-amber-100 dark:text-amber-400 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 transition-colors"
                      title="New Research"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                    {onClose && (
                        <button 
                            onClick={onClose} 
                            className="ml-2 p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 focus:outline-none"
                            aria-label="Close history panel"
                        >
                            <XIcon className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>

            {/* Profile Selector */}
            <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                <div className="flex items-center mb-2 space-x-2">
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Profile</span>
                </div>
                
                {!isAddingProfile ? (
                    <div className="flex items-center space-x-2">
                        <select 
                            value={currentProfile}
                            onChange={(e) => onSwitchProfile(e.target.value)}
                            className="flex-grow appearance-none block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                        >
                            {profiles.map(profile => (
                                <option key={profile} value={profile}>{profile}</option>
                            ))}
                        </select>
                        <button 
                            onClick={() => setIsAddingProfile(true)}
                            className="flex-shrink-0 p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
                            title="Create New Profile"
                        >
                            <PlusIcon className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleAddProfile} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={newProfileName}
                            onChange={(e) => setNewProfileName(e.target.value)}
                            placeholder="Profile Name"
                            autoFocus
                            className="flex-grow px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
                        />
                        <button 
                            type="submit"
                            disabled={!newProfileName.trim()}
                            className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-colors"
                        >
                            <PlusIcon className="w-4 h-4" />
                        </button>
                        <button 
                            type="button"
                            onClick={() => setIsAddingProfile(false)}
                            className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 transition-colors"
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                    </form>
                )}
            </div>

            <div className="flex-grow overflow-y-auto -mr-2 pr-2 custom-scrollbar">
                {history.length > 0 ? (
                    <ul role="list" className="space-y-2">
                        {history.map((item) => {
                            const isActive = item.id === activeReportId;
                            return (
                                <li key={item.id}>
                                    <button 
                                        onClick={() => onSelectReport(item)} 
                                        className={`w-full text-left relative flex flex-col py-3 px-4 rounded-xl transition-all duration-200 group border 
                                        ${isActive 
                                            ? 'bg-amber-50 border-amber-200/50 shadow-sm dark:bg-amber-900/10 dark:border-amber-500/20' 
                                            : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-3 bottom-3 w-1 bg-amber-500 rounded-r-full"></div>
                                        )}
                                        <div className={`flex justify-between items-start ${isActive ? 'pl-2' : ''}`}>
                                            <h3 className={`text-sm font-semibold truncate pr-2 ${isActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-200'}`}>
                                                {item.startupName}
                                            </h3>
                                        </div>
                                        <p className={`text-xs mt-1 ${isActive ? 'pl-2 text-amber-700/70 dark:text-amber-500/70' : 'text-slate-400 dark:text-slate-500'}`}>
                                            {formatDate(item.date)}
                                        </p>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="text-center py-12 flex flex-col items-center">
                         <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3">
                            <HistoryIcon className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                         </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">No reports yet.</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Reports for <span className="font-semibold">"{currentProfile}"</span> will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPanel;