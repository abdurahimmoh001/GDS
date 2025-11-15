import React from 'react';
import type { ChatMessage } from '../types';
import { LogoIcon } from './icons/LogoIcon';
import { MarkdownRenderer } from './MarkdownRenderer';
import { LinkIcon } from './icons/LinkIcon';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex items-start gap-3 ${isModel ? '' : 'flex-row-reverse'}`}>
      {isModel && (
         <div className="w-8 h-8 flex-shrink-0 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
            <LogoIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
         </div>
      )}
      <div className={`max-w-[80%]`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isModel
              ? 'bg-slate-100 dark:bg-slate-700 rounded-bl-none text-slate-800 dark:text-slate-200'
              : 'bg-blue-600 text-white rounded-br-none'
          }`}
        >
          <MarkdownRenderer text={message.content} />
        </div>
        {message.sources && message.sources.length > 0 && (
            <div className="mt-2 px-2">
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Sources:</h4>
                <ul className="space-y-1">
                    {message.sources.map((source, index) => (
                        <li key={index}>
                            <a 
                                href={source.uri} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-start gap-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                <LinkIcon className="w-3 h-3 mt-0.5 flex-shrink-0"/>
                                <span className="truncate">{source.title}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        )}
      </div>
    </div>
  );
};
