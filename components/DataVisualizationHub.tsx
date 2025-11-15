import React from 'react';
import type { Insight, VisualizationType } from '../types';
import { DataInsightsChart } from './charts/DataInsightsChart';
import { PieChartDisplay } from './charts/PieChartDisplay';
import { GaugeChart } from './charts/GaugeChart';
import { NumberCard } from './NumberCard';
import { TextInsights } from './TextInsights';

interface DataVisualizationHubProps {
  insights: Insight[];
  theme: 'light' | 'dark';
}

export const DataVisualizationHub: React.FC<DataVisualizationHubProps> = ({ insights, theme }) => {
  
  const groupedInsights = insights.reduce((acc, insight) => {
    const type = insight.visualizationType || 'NUMBER_CARD'; // Fallback
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(insight);
    return acc;
  }, {} as Record<VisualizationType, Insight[]>);
  
  const barData = groupedInsights.BAR_CHART || [];
  const pieData = groupedInsights.PIE_CHART || [];
  const gaugeData = groupedInsights.GAUGE_CHART || [];
  const cardData = groupedInsights.NUMBER_CARD || [];
  const textData = groupedInsights.NONE || [];
  
  return (
    <div className="space-y-8">
      {barData.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700/50">
           <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-4">Comparative Metrics</h4>
           <DataInsightsChart data={barData} theme={theme} />
        </div>
      )}

      {(pieData.length > 0 || gaugeData.length > 0 || cardData.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cardData.map((insight, i) => (
                <NumberCard key={`card-${i}`} insight={insight} />
            ))}
            {pieData.map((insight, i) => (
            <PieChartDisplay key={`pie-${i}`} insight={insight} theme={theme} />
            ))}
            {gaugeData.map((insight, i) => (
            <GaugeChart key={`gauge-${i}`} insight={insight} theme={theme} />
            ))}
        </div>
      )}

      {textData.length > 0 && (
         <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700/50">
           <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-4">Additional Data Points</h4>
           <TextInsights insights={textData} />
        </div>
      )}
    </div>
  );
};