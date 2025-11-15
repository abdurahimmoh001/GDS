import React, { useState, useEffect } from 'react';
import { FileScanIcon } from './icons/FileScanIcon';
import { WebScanIcon } from './icons/WebScanIcon';
import { ChartGenIcon } from './icons/ChartGenIcon';
import { ReportCompileIcon } from './icons/ReportCompileIcon';


const stages = [
    { Icon: FileScanIcon, text: 'Analyzing provided documents...' },
    { Icon: WebScanIcon, text: 'Scouting for web data...' },
    { Icon: ChartGenIcon, text: 'Visualizing key insights...' },
    { Icon: ReportCompileIcon, text: 'Compiling final report...' }
];

const STAGE_DURATION = 2800; // ms

const LoadingScreen: React.FC = () => {
    const [currentStage, setCurrentStage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStage(prevStage => {
                // Loop back to 0 if it's the last stage, otherwise increment
                return prevStage === stages.length - 1 ? 0 : prevStage + 1;
            });
        }, STAGE_DURATION);

        return () => clearInterval(interval);
    }, []);

    const { Icon, text } = stages[currentStage];
    const progressPercentage = ((currentStage + 1) / stages.length) * 100;

    return (
        <div className="relative flex flex-col items-center justify-center text-center h-full min-h-[500px] overflow-hidden bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="absolute inset-0 z-0 animated-background"></div>

            <div className="relative z-10 flex flex-col items-center justify-center p-4 w-full max-w-md">
                <div className="w-24 h-24 text-blue-600 dark:text-blue-500 flex items-center justify-center">
                    <Icon className="w-full h-full" />
                </div>
                <p className="mt-6 text-xl font-semibold text-slate-900 dark:text-slate-200">
                    Generating Your Report
                </p>
                <p className={`mt-2 text-slate-500 dark:text-slate-400 transition-opacity duration-500 min-h-[24px]`}>
                    {text}
                </p>

                <div className="w-full max-w-xs bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-8 overflow-hidden relative">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;