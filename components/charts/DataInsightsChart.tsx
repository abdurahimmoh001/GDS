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
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="metric" tick={{
        fill: tickColor,
        fontSize: 12
    }} />
          <YAxis tickFormatter={formatYAxisTick} tick={{
        fill: tickColor,
        fontSize: 12
    }} />
          <Tooltip
            cursor={{
        fill: theme === 'dark' ? 'rgba(100, 116, 139, 0.2)' : 'rgba(203, 213, 225, 0.4)'
    }}
            contentStyle={{
        backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff', // slate-800 : white
        borderColor: theme === 'dark' ? '#334155' : '#e2e8f0', // slate-700 : slate-200
    }}
            labelStyle={{
        color: theme === 'dark' ? '#f1f5f9' : '#0f172a'
    }} // slate-100 : slate-900
            formatter={(value, name, props) => [props.payload.value, 'Value']}
          />
          <Bar dataKey="numericalValue" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    );
};