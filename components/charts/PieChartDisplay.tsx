import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { Insight } from '../../types';

interface PieChartDisplayProps {
  insight: Insight;
  theme: 'light' | 'dark';
}

const COLORS = ['#3b82f6', '#e2e8f0']; // blue-500, slate-200
const COLORS_DARK = ['#3b82f6', '#334155']; // blue-500, slate-700

export const PieChartDisplay: React.FC<PieChartDisplayProps> = ({ insight, theme }) => {
  // Pie chart data expects an array. We create one for the value and the remainder if it's a percentage.
  const isPercentage = insight.numericalValue >= 0 && insight.numericalValue <= 100;
  const data = isPercentage
    ? [
        { name: insight.metric, value: insight.numericalValue },
        { name: 'Remainder', value: 100 - insight.numericalValue },
      ]
    : [{ name: insight.metric, value: insight.numericalValue }];
  
  const colors = theme === 'dark' ? COLORS_DARK : COLORS;
  const labelColor = theme === 'dark' ? '#f1f5f9' : '#0f172a';

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700/50 h-full flex flex-col">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{insight.metric}</p>
      <div className="w-full h-48 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
              }}
              labelStyle={{ color: labelColor }}
              formatter={(value, name) => [isPercentage ? `${value}%` : value, name]}
              filterNull={false}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              fill="#8884d8"
              paddingAngle={isPercentage ? 5 : 0}
              dataKey="value"
              startAngle={90}
              endAngle={450}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke={'none'} />
              ))}
            </Pie>
             <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill={labelColor} fontSize="24" fontWeight="bold">
              {insight.value}
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 text-center mt-2">{insight.commentary}</p>
    </div>
  );
};
