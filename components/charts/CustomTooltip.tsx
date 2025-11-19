import React from 'react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    // Don't render tooltip for empty/remainder data points
    if (!data.metric || data.metric === 'Remainder') {
      return null;
    }

    return (
      <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 animate-slide-in-up transition-all duration-300">
        <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{data.metric}</p>
        <p className="text-blue-600 dark:text-blue-400 text-lg font-semibold my-1">{data.value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">{data.commentary}</p>
      </div>
    );
  }

  return null;
};
