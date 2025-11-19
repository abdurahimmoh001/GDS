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
import { PlusIcon } from './icons/PlusIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { LinkIcon } from './icons/LinkIcon';
import { MarkdownRenderer } from './MarkdownRenderer';
import { DataVisualizationHub } from './DataVisualizationHub';
import { ChatIcon } from './icons/ChatIcon';


interface ReportPanelProps {
  report: ResearchReport | null;
  onStartNew: () => void;
  theme: 'light' | 'dark';
  startupName: string;
  onOpenChatbot: () => void;
}

const ReportSection: React.FC < {
  title: string;
  children: React.ReactNode
} > = ({
  title,
  children
}) => (
  <div className="py-10 border-b border-slate-100 dark:border-slate-800 last:border-b-0">
    <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-amber-500 mb-6 flex items-center">
        <span className="w-1 h-6 bg-amber-500 rounded-full mr-3 inline-block"></span>
        {title}
    </h3>
    <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-heading prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-li:text-slate-600 dark:prose-li:text-slate-300 prose-strong:text-slate-900 dark:prose-strong:text-slate-100 prose-strong:font-semibold">
        {children}
    </div>
  </div>
);


const ReportPanel: React.FC < ReportPanelProps > = ({
  report,
  onStartNew,
  theme,
  startupName,
  onOpenChatbot,
}) => {
  const reportContentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingDoc, setIsExportingDoc] = useState(false);

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
        backgroundColor: theme === 'dark' ? '#020617' : '#ffffff', // slate-950 or white
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
      pdf.save(`GDS-Report-${startupName.replace(/\s+/g, '-')}.pdf`);

    } catch (err) {
      console.error("Failed to export PDF:", err);
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleExportDoc = () => {
    if (!report) return;
    setIsExportingDoc(true);

    const generateDocContent = (reportData: ResearchReport, startup: string): string => {
        const escapeHtml = (unsafe: string) => {
             return unsafe
                 .replace(/&/g, "&amp;")
                 .replace(/</g, "&lt;")
                 .replace(/>/g, "&gt;")
                 .replace(/"/g, "&quot;")
                 .replace(/'/g, "&#039;");
        }
        
        const formatMarkdown = (text: string) => {
            if (!text) return '';
            return escapeHtml(text).replace(/\*([^*]+)\*/g, '<strong>$1</strong>').replace(/\n+/g, '<br />');
        }
        
        let htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Calibri', sans-serif; font-size: 11pt; color: #333; }
                    h1 { font-size: 24pt; color: #D97706; text-align: center; font-weight: bold; }
                    h2 { font-size: 16pt; color: #D97706; border-bottom: 1px solid #eee; padding-bottom: 6px; margin-top: 24px; font-weight: bold;}
                    h3 { font-size: 12pt; color: #333; font-weight: bold; margin-top: 16px; }
                    p, li { line-height: 1.5; margin-bottom: 10px; }
                    table { border-collapse: collapse; width: 100%; margin-top: 10px; font-size: 10pt; }
                    th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; vertical-align: top; }
                    th { background-color: #fffbeb; color: #b45309; font-weight: bold; }
                    ul { margin-left: 20px; padding-left: 5px; }
                    a { color: #d97706; text-decoration: underline; }
                    .header { text-align: center; margin-bottom: 40px; }
                    .footer { text-align: center; font-size: 9pt; color: #9ca3af; margin-top: 40px; border-top: 1px solid #eee; padding-top: 10px;}
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Golden Data Stream Report</h1>
                    <p>Prepared for <strong>${escapeHtml(startup)}</strong></p>
                </div>
                
                <h2>Executive Summary</h2>
                <p>${formatMarkdown(reportData.executiveSummary)}</p>

                <h2>Market Analysis</h2>
                <h3>Market Size</h3>
                <p>${escapeHtml(reportData.marketAnalysis.marketSize)}</p>
                <h3>Key Trends</h3>
                <ul>${reportData.marketAnalysis.keyTrends.map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul>
                <h3>Competitor Landscape</h3>
                <table>
                    <thead>
                        <tr><th>Competitor</th><th>Strengths</th><th>Weaknesses</th></tr>
                    </thead>
                    <tbody>
                        ${reportData.marketAnalysis.competitorLandscape.map(c => `
                            <tr>
                                <td><strong>${escapeHtml(c.name)}</strong></td>
                                <td>${escapeHtml(c.strengths)}</td>
                                <td>${escapeHtml(c.weaknesses)}</td>
                            </tr>`).join('')}
                    </tbody>
                </table>

                <h2>Data Insights</h2>
                <table>
                    <thead>
                        <tr><th>Metric</th><th>Value</th><th>Commentary</th></tr>
                    </thead>
                    <tbody>
                        ${reportData.dataInsights.map(i => `
                            <tr>
                                <td>${escapeHtml(i.metric)}</td>
                                <td><strong>${escapeHtml(i.value)}</strong></td>
                                <td>${escapeHtml(i.commentary)}</td>
                            </tr>`).join('')}
                    </tbody>
                </table>
        `;
        
        if (reportData.strategicPerspectives) {
            htmlContent += `
                <h2>Strategic Perspectives</h2>
                <p>${formatMarkdown(reportData.strategicPerspectives)}</p>
            `;
        }
        
        if (reportData.sources && reportData.sources.length > 0) {
            htmlContent += `
                <h2>Sources</h2>
                <ul>
                    ${reportData.sources.map(s => `<li><a href="${s.uri}">${escapeHtml(s.title)}</a></li>`).join('')}
                </ul>
            `;
        }

        htmlContent += `
                <div class="footer">
                    <p>Generated by Golden Data Stream on ${new Date().toLocaleDateString()}</p>
                </div>
            </body>
            </html>
        `;

        return htmlContent;
    }
    
    const content = generateDocContent(report, startupName);
    const blob = new Blob(['\ufeff', content], {
        type: 'application/msword'
    });
    
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `GDS-Report-${startupName.replace(/\s+/g, '-')}.doc`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    setIsExportingDoc(false);
  };


  const handleExportCsv = () => {
    if (!report) return;

    const escapeCsvCell = (cellData: any): string => {
        const stringData = String(cellData ?? '');
        if (stringData.includes(',') || stringData.includes('"') || stringData.includes('\n')) {
            return `"${stringData.replace(/"/g, '""')}"`;
        }
        return stringData;
    };

    const rows: string[][] = [];

    // Add high-level text sections
    rows.push(['Section', 'Detail']);
    rows.push(['Executive Summary', report.executiveSummary]);
    if (report.strategicPerspectives) {
        rows.push(['Strategic Perspectives', report.strategicPerspectives]);
    }
    rows.push(['Market Size', report.marketAnalysis.marketSize]);
    rows.push(['Key Trends', report.marketAnalysis.keyTrends.join('; ')]);
    rows.push([]); // Spacer row

    // Competitor Landscape
    rows.push(['Competitor', 'Strengths', 'Weaknesses']);
    report.marketAnalysis.competitorLandscape.forEach(c => {
        rows.push([c.name, c.strengths, c.weaknesses]);
    });
    rows.push([]); // Spacer row

    // Data Insights
    rows.push(['Metric', 'Value', 'Numerical Value', 'Commentary', 'Visualization Type']);
    report.dataInsights.forEach(i => {
        rows.push([i.metric, i.value, String(i.numericalValue), i.commentary, i.visualizationType]);
    });
    rows.push([]);

    // Sources
    if (report.sources && report.sources.length > 0) {
        rows.push(['Source Title', 'Source URI']);
        report.sources.forEach(s => {
            rows.push([s.title, s.uri]);
        });
    }

    const csvContent = rows.map(row => row.map(escapeCsvCell).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `GDS-Report-${startupName.replace(/\s+/g, '-')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };
  
  if (!report) {
       return (
      <div className="flex flex-col items-center justify-center text-center h-full border-2 border-dashed border-slate-200 rounded-3xl p-8 dark:border-slate-800 min-h-[500px]">
        <div className="text-amber-600 bg-amber-50 dark:bg-amber-900/10 rounded-full p-4">
          <DocumentIcon className="h-10 w-10" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-200">Something went wrong</h3>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Could not display the report. Please try again from the history.</p>
        <button onClick={onStartNew} className="mt-6 flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors">
           Start New Research
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:shadow-none transition-all duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 -mt-2">
             <div>
                <p className="text-sm font-semibold text-amber-600 dark:text-amber-500 uppercase tracking-wide mb-1">Research Report</p>
                <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-slate-100">{startupName}</h2>
             </div>
             <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={onStartNew}
                  className="flex-grow sm:flex-grow-0 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:bg-amber-600/10 dark:text-amber-400 dark:hover:bg-amber-600/20 dark:focus:ring-offset-slate-800 transition-colors"
                >
                  <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
                  New
                </button>
                 <button
                    onClick={handleExportPdf}
                    disabled={isExporting}
                    className="flex-grow sm:flex-grow-0 flex items-center justify-center px-4 py-2 border border-slate-200 text-sm font-medium rounded-xl text-slate-600 bg-white hover:bg-slate-50 hover:text-amber-600 hover:border-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-slate-50 disabled:text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-amber-400 dark:focus:ring-offset-slate-800 transition-colors"
                  >
                    {isExporting ? (
                      <>
                        <LoaderIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        PDF...
                      </>
                    ) : (
                      <>
                        <DownloadIcon className="-ml-1 mr-2 h-4 w-4" />
                        PDF
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleExportDoc}
                    disabled={isExportingDoc}
                    className="flex-grow sm:flex-grow-0 flex items-center justify-center px-4 py-2 border border-slate-200 text-sm font-medium rounded-xl text-slate-600 bg-white hover:bg-slate-50 hover:text-amber-600 hover:border-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-slate-50 disabled:text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-amber-400 dark:focus:ring-offset-slate-800 transition-colors"
                  >
                     {isExportingDoc ? (
                      <>
                        <LoaderIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        DOC...
                      </>
                    ) : (
                      <>
                        <DownloadIcon className="-ml-1 mr-2 h-4 w-4" />
                        DOC
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleExportCsv}
                    className="flex-grow sm:flex-grow-0 flex items-center justify-center px-4 py-2 border border-slate-200 text-sm font-medium rounded-xl text-slate-600 bg-white hover:bg-slate-50 hover:text-amber-600 hover:border-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-amber-400 dark:focus:ring-offset-slate-800 transition-colors"
                  >
                    <DownloadIcon className="-ml-1 mr-2 h-4 w-4" />
                    CSV
                  </button>
            </div>
          </div>
          <div ref={reportContentRef}>
             <div id="pdf-content" className="p-4 sm:p-6 md:p-8 bg-white dark:bg-slate-950 rounded-2xl">
                <div className="text-center mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                  <h1 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900 dark:text-slate-50 mb-2">Market Research Report</h1>
                  <p className="text-lg text-slate-500 dark:text-slate-400">Prepared for <span className="text-amber-600 dark:text-amber-500 font-semibold">{startupName}</span></p>
                </div>
                <div>
                  <ReportSection title="Executive Summary">
                    <MarkdownRenderer text={report.executiveSummary}/>
                  </ReportSection>

                  <ReportSection title="Market Analysis">
                    <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200 font-heading">Market Size</h4>
                    <p className="mt-2 mb-8">{report.marketAnalysis.marketSize}</p>
                    
                    <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200 font-heading">Key Trends</h4>
                    <ul className="list-disc pl-5 mt-2 mb-8 space-y-3">
                      {report.marketAnalysis.keyTrends.map((trend, i) => <li key={i}>{trend}</li>)}
                    </ul>
                    
                    <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200 font-heading mb-4">Competitor Landscape</h4>
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                          <thead className="bg-slate-50 dark:bg-slate-900">
                            <tr>
                              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Competitor</th>
                              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Strengths</th>
                              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Weaknesses</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-200 dark:bg-slate-950 dark:divide-slate-800">
                            {report.marketAnalysis.competitorLandscape.map((c, i) => (
                              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-slate-200 align-top">{c.name}</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 align-top">{c.strengths}</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 align-top">{c.weaknesses}</td>
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
                  
                  {report.sources && report.sources.length > 0 && (
                     <ReportSection title="Sources">
                        <ul className="list-none p-0 space-y-3">
                           {report.sources.map((source, i) => (
                               <li key={i} className="flex items-start">
                                    <LinkIcon className="w-4 h-4 mr-3 mt-1 flex-shrink-0 text-amber-500" />
                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-500 hover:underline hover:text-amber-700 break-all transition-colors">
                                      {source.title}
                                    </a>
                                </li>
                           ))}
                        </ul>
                     </ReportSection>
                  )}
                </div>
                <div className="mt-16 pt-8 text-center text-xs text-slate-400 dark:text-slate-600 border-t border-slate-100 dark:border-slate-900">
                    <p className="font-medium">Golden Data Stream • {new Date().getFullYear()}</p>
                </div>
             </div>
          </div>
        </div>
        <button
            onClick={onOpenChatbot}
            className="fixed bottom-8 right-8 z-30 flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full shadow-xl shadow-amber-500/40 hover:scale-110 hover:shadow-amber-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:focus:ring-offset-slate-900 transition-all duration-300"
            aria-label="Open AI Assistant to Edit Report"
        >
            <ChatIcon className="w-7 h-7" />
        </button>
    </div>
  );
};

export default ReportPanel;