import React from 'react';
import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar
} from 'recharts';
import type {
    Insight
} from '../../types';
import { CustomTooltip } from './CustomTooltip';

interface DataInsightsChartProps {
    data: Insight[];
    theme: 'light' | 'dark';
}

// A formatter for large numbers on the Y-axis
const formatYAxisTick = (value: number) => {
    if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(1)}B`;
    }
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
        return `${(value / 1_000).toFixed(1)}K`;
    }
    return value.toString();
};

export const DataInsightsChart: React.FC < DataInsightsChartProps > = ({
    data,
    theme
}) => {
    const tickColor = theme === 'dark' ? '#94a3b8' : '#64748b'; // slate-400 : slate-500
    const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0'; // slate-700 : slate-200

    // Filter out any insights that might be missing a numerical value
    const chartData = data.filter(d => typeof d.numericalValue === 'number');

    if (chartData.length === 0) {
        return null;
    }

    return (
        <div style={{
        width: '100%',
        height: 300
    }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{
        top: 5,
        right: 20,
        left: 10,
        bottom: 5
    }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="metric" tick={{
            fill: tickColor,
            fontSize: 12,
            fontFamily: 'Inter, sans-serif'
            }} 
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis tickFormatter={formatYAxisTick} tick={{
            fill: tickColor,
            fontSize: 12,
            fontFamily: 'Inter, sans-serif'
            }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              fill: theme === 'dark' ? 'rgba(251, 191, 36, 0.05)' : 'rgba(251, 191, 36, 0.1)'
            }}
          />
          <Bar 
            dataKey="numericalValue" 
            fill="url(#barGradient)" 
            radius={[4, 4, 0, 0]}
            barSize={40}
          />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity={1}/>
              <stop offset="100%" stopColor="#d97706" stopOpacity={1}/>
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
    );
};