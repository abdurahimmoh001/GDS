import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type {
  ResearchReport
} from '../types';
import {
  LoaderIcon
} from './icons/LoaderIcon';
import {
  DocumentIcon
} from './icons/DocumentIcon';
import {
  HomeIcon
} from './icons/HomeIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { MarkdownRenderer } from './MarkdownRenderer';
import { DataVisualizationHub } from './DataVisualizationHub';


interface ReportPanelProps {
  report: ResearchReport | null;
  onReturnHome: () => void;
  theme: 'light' | 'dark';
  startupName: string;
}

const ReportSection: React.FC < {
  title: string;
  children: React.ReactNode
} > = ({
  title,
  children
}) => (
  <div className="py-8 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">{title}</h3>
    <div className="prose prose-slate max-w-none dark:prose-invert prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-li:text-slate-600 dark:prose-li:text-slate-300">
        {children}
    </div>
  </div>
);


const ReportPanel: React.FC < ReportPanelProps > = ({
  report,
  onReturnHome,
  theme,
  startupName
}) => {
  const reportContentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = async () => {
    const contentToCapture = reportContentRef.current?.querySelector('#pdf-content');
    if (!contentToCapture) {
        console.error("PDF content area not found.");
        return;
    }
    setIsExporting(true);
    try {
      const canvas = await html2canvas(contentToCapture as HTMLElement, {
        scale: 2, // Higher scale for better quality
        backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff', // slate-900 or white
        useCORS: true,
        windowWidth: 1024 // Set a fixed width for consistent PDF layout
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`GoldenDataStream-Report-${startupName.replace(/\s+/g, '-')}.pdf`);

    } catch (err) {
      console.error("Failed to export PDF:", err);
    } finally {
      setIsExporting(false);
    }
  };
  
  if (!report) {
       return (
      <div className="flex flex-col items-center justify-center text-center h-full border-2 border-dashed border-slate-300 rounded-2xl p-8 dark:border-slate-600 min-h-[500px]">
        <div className="text-blue-600 bg-blue-100 dark:bg-blue-600/10 rounded-full p-3">
          <DocumentIcon className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-200">Something went wrong</h3>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Could not display the report. Please try again from the history.</p>
        <button onClick={onReturnHome} className="mt-4 flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
           Return Home
        </button>
      </div>
    );
  }

  return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6 -mt-2">
             <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Research Report</h2>
             <div className="flex items-center space-x-2">
                <button
                  onClick={onReturnHome}
                  className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-600/20 dark:text-blue-300 dark:hover:bg-blue-600/30 dark:focus:ring-offset-slate-800 transition-colors"
                >
                  <HomeIcon className="-ml-1 mr-2 h-5 w-5" />
                  Return Home
                </button>
                 <button
                    onClick={handleExportPdf}
                    disabled={isExporting}
                    className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-slate-700 bg-slate-200 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-200 disabled:text-slate-400 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:disabled:bg-slate-600 dark:disabled:text-slate-500 dark:focus:ring-offset-slate-800 transition-colors"
                  >
                    {isExporting ? (
                      <>
                        <LoaderIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <DownloadIcon className="-ml-1 mr-2 h-5 w-5" />
                        Export PDF
                      </>
                    )}
                  </button>
            </div>
          </div>
          <div ref={reportContentRef}>
             <div id="pdf-content" className="p-10 bg-white dark:bg-slate-900">
                <div className="text-center mb-10 border-b border-slate-200 dark:border-slate-700 pb-8">
                  <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Market Research Report</h1>
                  <p className="text-xl text-slate-500 dark:text-slate-400 mt-2">Prepared for {startupName}</p>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  <ReportSection title="Executive Summary">
                    <MarkdownRenderer text={report.executiveSummary}/>
                  </ReportSection>

                  <ReportSection title="Market Analysis">
                    <h4 className="font-semibold text-base text-slate-800 dark:text-slate-200">Market Size</h4>
                    <p className="mt-1">{report.marketAnalysis.marketSize}</p>
                    <h4 className="font-semibold text-base text-slate-800 dark:text-slate-200 mt-6">Key Trends</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                      {report.marketAnalysis.keyTrends.map((trend, i) => <li key={i}>{trend}</li>)}
                    </ul>
                    <h4 className="font-semibold text-base text-slate-800 dark:text-slate-200 mt-6">Competitor Landscape</h4>
                    <div className="overflow-x-auto mt-2 -mx-2">
                        <table className="min-w-full">
                          <thead >
                            <tr>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Competitor</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Strengths</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Weaknesses</th>
                            </tr>
                          </thead>
                          <tbody>
                            {report.marketAnalysis.competitorLandscape.map((c, i) => (
                              <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800/50'}>
                                <td className="px-4 py-4 text-sm font-medium text-slate-800 dark:text-slate-200 align-top border-t border-slate-200 dark:border-slate-800">{c.name}</td>
                                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300 align-top border-t border-slate-200 dark:border-slate-800">{c.strengths}</td>
                                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300 align-top border-t border-slate-200 dark:border-slate-800">{c.weaknesses}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                    </div>
                  </ReportSection>

                  <ReportSection title="Data Insights">
                    <DataVisualizationHub insights={report.dataInsights} theme={theme} />
                  </ReportSection>

                  {report.strategicPerspectives && (
                    <ReportSection title="Strategic Perspectives">
                      <MarkdownRenderer text={report.strategicPerspectives} />
                    </ReportSection>
                  )}
                </div>
                <div className="mt-12 pt-8 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-700">
                    <p>Generated by Golden Data Stream on {new Date().toLocaleDateString()}</p>
                </div>
             </div>
          </div>
        </div>
      );
};

export default ReportPanel;