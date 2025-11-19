import React from 'react';
import type { Insight } from '../types';

interface NumberCardProps {
  insight: Insight;
}

export const NumberCard: React.FC<NumberCardProps> = ({ insight }) => (
  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700/50 h-full flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
    <div>
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">{insight.metric}</p>
      <p className="text-4xl font-bold text-slate-900 dark:text-white mt-3 pb-2 border-b-4 border-amber-400 inline-block">{insight.value}</p>
    </div>
    <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">{insight.commentary}</p>
  </div>
);