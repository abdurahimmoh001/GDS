import React from 'react';
import type { Insight } from '../types';

interface NumberCardProps {
  insight: Insight;
}

export const NumberCard: React.FC<NumberCardProps> = ({ insight }) => (
  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700/50 h-full flex flex-col justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{insight.metric}</p>
      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{insight.value}</p>
    </div>
    <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">{insight.commentary}</p>
  </div>
);
