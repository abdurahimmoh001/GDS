
import React, { useState, useEffect } from 'react';
import { FileScanIcon } from './icons/FileScanIcon';
import { WebScanIcon } from './icons/WebScanIcon';
import { ChartGenIcon } from './icons/ChartGenIcon';
import { ReportCompileIcon } from './icons/ReportCompileIcon';


const stages = [
    { 
        Icon: FileScanIcon, 
        text: 'Analyzing Documents', 
        subtext: 'Extracting entities & context...' 
    },
    { 
        Icon: WebScanIcon, 
        text: 'Scouting Web Data', 
        subtext: 'Querying Google Scholar & Reports...' 
    },
    { 
        Icon: ChartGenIcon, 
        text: 'Visualizing Insights', 
        subtext: 'Synthesizing market trends...' 
    },
    { 
        Icon: ReportCompileIcon, 
        text: 'Compiling Report', 
        subtext: 'Formatting executive summary...' 
    }
];

const STAGE_DURATION = 3000; 

const LoadingScreen: React.FC = () => {
    const [currentStage, setCurrentStage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStage(prevStage => {
                return (prevStage + 1) % stages.length;
            });
        }, STAGE_DURATION);

        return () => clearInterval(interval);
    }, []);

    const { Icon, text, subtext } = stages[currentStage];

    return (
        <div className="relative flex flex-col items-center justify-center text-center h-full min-h-[600px] overflow-hidden bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-2xl">
            
            {/* Ambient Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center p-8 w-full max-w-lg">
                
                {/* Animated Icon Hub */}
                <div className="relative mb-14">
                    {/* Rotating Outer Ring */}
                    <div className="absolute inset-[-24px] border-2 border-dashed border-amber-200 dark:border-amber-900/40 rounded-full animate-[spin_12s_linear_infinite]"></div>
                    
                    {/* Pulsing Inner Ring */}
                    <div className="absolute inset-[-12px] border border-amber-400/20 dark:border-amber-500/20 rounded-full animate-ping opacity-20"></div>
                    
                    {/* Main Icon Circle */}
                    <div className="relative w-36 h-36 bg-white dark:bg-slate-900 rounded-full shadow-2xl shadow-amber-500/10 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                         <div key={currentStage} className="animate-slide-in-up">
                            <Icon className="w-16 h-16 text-amber-500 dark:text-amber-400" />
                        </div>
                    </div>

                    {/* Decorators */}
                    <div className="absolute top-1/2 -left-16 w-12 h-[1px] bg-gradient-to-r from-transparent to-slate-300 dark:to-slate-700"></div>
                    <div className="absolute top-1/2 -right-16 w-12 h-[1px] bg-gradient-to-l from-transparent to-slate-300 dark:to-slate-700"></div>
                </div>

                {/* Text Information */}
                <div className="space-y-3 mb-12 min-h-[90px]">
                    <h2 key={text} className="text-3xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 animate-fade-in">
                        {text}
                    </h2>
                    <p key={subtext} className="text-slate-500 dark:text-slate-400 font-medium text-lg animate-fade-in animation-delay-100">
                        {subtext}
                    </p>
                </div>

                {/* High-End Progress Bar */}
                <div className="w-full max-w-sm bg-slate-100 dark:bg-slate-800 rounded-full h-4 p-1 shadow-inner">
                    <div className="h-full w-full rounded-full overflow-hidden relative">
                         <div 
                            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 transition-all duration-700 ease-in-out rounded-full flex items-center"
                            style={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
                        >
                            {/* Striped Animation */}
                            <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[progress-stripes_1s_linear_infinite]"></div>
                        </div>
                    </div>
                </div>
                
                {/* Stage Dots */}
                <div className="flex justify-between w-full max-w-[360px] mt-6 px-2">
                    {stages.map((_, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2">
                            <div 
                                className={`h-2 w-2 rounded-full transition-all duration-500 ${
                                    idx <= currentStage 
                                        ? 'bg-amber-500 scale-125 shadow-[0_0_10px_rgba(245,158,11,0.5)]' 
                                        : 'bg-slate-200 dark:bg-slate-800'
                                }`}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
