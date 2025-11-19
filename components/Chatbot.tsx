import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, ResearchReport } from '../types';
import { ChatBubble } from './ChatBubble';
import { XIcon } from './icons/XIcon';
import { SendIcon } from './icons/SendIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { LoaderIcon } from './icons/LoaderIcon';

interface ChatbotProps {
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onApplyEdit: (updatedReport: ResearchReport) => void;
  isResponding: boolean;
  startupName: string;
}

export const Chatbot: React.FC<ChatbotProps> = ({ onClose, messages, onSendMessage, onApplyEdit, isResponding, startupName }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-end sm:items-center p-4">
      <div className="animate-slide-in-up w-full max-w-2xl h-[85vh] sm:h-[800px] sm:max-h-[85vh] flex flex-col bg-white dark:bg-slate-900 shadow-2xl shadow-black/20 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 p-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-xl">
                 <SparklesIcon className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            </div>
            <div>
              <h2 className="font-bold font-heading text-slate-900 dark:text-slate-100">AI Assistant</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Editing report for <span className="text-amber-600 dark:text-amber-500 font-medium">{startupName}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors focus:outline-none"
            aria-label="Close chat"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-grow p-4 sm:p-6 overflow-y-auto chat-messages bg-slate-50 dark:bg-slate-950/50">
          <div className="space-y-6">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} onApplyEdit={onApplyEdit} />
            ))}
            {isResponding && (
                <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm border border-slate-100 dark:border-slate-700 max-w-[85%]">
                        <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-sm">
                            <LoaderIcon className="animate-spin h-4 w-4" />
                            <span>Thinking...</span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
          <form onSubmit={handleSend} className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-full border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-amber-500/50 focus-within:border-amber-500 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for an explanation or an edit..."
              className="flex-grow px-4 py-2.5 bg-transparent border-none focus:ring-0 placeholder-slate-400 text-slate-800 dark:text-slate-100 text-sm sm:text-base"
              disabled={isResponding}
            />
            <button
              type="submit"
              disabled={!input.trim() || isResponding}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100 transition-all duration-200 focus:outline-none"
              aria-label="Send message"
            >
              <SendIcon className="w-5 h-5 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};