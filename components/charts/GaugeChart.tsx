import React, { useState, useCallback } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Sector } from 'recharts';
import type { Insight } from '../../types';
import { CustomTooltip } from './CustomTooltip';


interface GaugeChartProps {
  insight: Insight;
  theme: 'light' | 'dark';
}

const GAUGE_COLORS = ['#d97706', '#e2e8f0']; // amber-600, slate-200
const GAUGE_COLORS_DARK = ['#fbbf24', '#334155']; // amber-400, slate-700

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;

  // Don't render active shape for the remainder slice
  if (payload.metric === 'Remainder') {
     return (
        <g>
          <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
          />
        </g>
      );
  }

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export const GaugeChart: React.FC<GaugeChartProps> = ({ insight, theme }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = useCallback((_: any, index: number) => {
    setActiveIndex(index);
  }, [setActiveIndex]);
  
  const data = [
    { ...insight, chartValue: insight.numericalValue },
    { name: 'Remainder', chartValue: 100 - insight.numericalValue, metric: 'Remainder', commentary: '', value: '' },
  ];
  
  const colors = theme === 'dark' ? GAUGE_COLORS_DARK : GAUGE_COLORS;
  const labelColor = theme === 'dark' ? '#f1f5f9' : '#0f172a';

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700/50 h-full flex flex-col">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{insight.metric}</p>
      <div className="w-full h-48 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              fill="#8884d8"
              paddingAngle={0}
              dataKey="chartValue"
              startAngle={180}
              endAngle={0}
              stroke="none"
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={onPieEnter}
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
            <text x="50%" y="45%" textAnchor="middle" dominantBaseline="central" fill={labelColor} fontSize="24" fontWeight="700" fontFamily="Inter">
              {insight.value}
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
       <p className="text-sm text-slate-600 dark:text-slate-300 text-center -mt-8 leading-relaxed">{insight.commentary}</p>
    </div>
  );
};