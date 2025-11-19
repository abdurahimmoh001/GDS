import React from 'react';
import type { ChatMessage, ResearchReport } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { SparklesIcon } from './icons/SparklesIcon';

interface ChatBubbleProps {
  message: ChatMessage;
  onApplyEdit: (updatedReport: ResearchReport) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onApplyEdit }) => {
  const isUser = message.role === 'user';
  const hasEdit = !!message.updatedReport;

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl rounded-tr-none px-5 py-3.5 max-w-[85%] shadow-md shadow-orange-500/20">
          <p className="text-sm sm:text-base leading-relaxed">{message.text}</p>
        </div>
      </div>
    );
  }

  // Gemini Bubble
  return (
    <div className="flex justify-start">
      <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm border border-slate-100 dark:border-slate-700 max-w-[90%]">
        <div className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-p:text-slate-700 dark:prose-p:text-slate-300">
            <MarkdownRenderer text={message.text} />
        </div>
        {hasEdit && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
             <button 
                onClick={() => message.updatedReport && onApplyEdit(message.updatedReport)}
                className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-semibold rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30 dark:hover:bg-amber-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:focus:ring-offset-slate-800 transition-colors"
            >
                <SparklesIcon className="-ml-1 mr-2 h-4 w-4" />
                Apply Changes to Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};