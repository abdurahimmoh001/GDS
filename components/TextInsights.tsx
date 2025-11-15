import React from 'react';
import type { Insight } from '../types';

interface TextInsightsProps {
  insights: Insight[];
}

export const TextInsights: React.FC<TextInsightsProps> = ({ insights }) => {
  return (
    <div className="flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle">
          <table className="min-w-full divide-y divide-slate-300 dark:divide-slate-700">
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-100 sm:pl-0">
                  Metric
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Value
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Commentary
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {insights.map((insight, i) => (
                <tr key={i}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 dark:text-slate-100 sm:pl-0">
                    {insight.metric}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300">{insight.value}</td>
                  <td className="whitespace-normal px-3 py-4 text-sm text-slate-500 dark:text-slate-300">{insight.commentary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};