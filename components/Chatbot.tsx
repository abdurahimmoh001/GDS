
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { getChatbotResponse } from '../services/geminiService';
import { XIcon } from './icons/XIcon';
import { SendIcon } from './icons/SendIcon';
import { ChatBubble } from './ChatBubble';
import { LoaderIcon } from './icons/LoaderIcon';
import { LogoIcon } from './icons/LogoIcon';

interface ChatbotProps {
  onClose: () => void;
}

const initialMessage: ChatMessage = {
  role: 'model',
  content: "Hello! I'm the GDS Assistant. How can I help you with your desk research today? Feel free to ask about recent trends, specific companies, or industry news.",
};

export const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const modelResponse = await getChatbotResponse(input);
      setMessages(prev => [...prev, modelResponse]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'model',
        content: "Sorry, I couldn't get a response. Please check your connection or try again."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-[calc(100%-48px)] max-w-md h-[70vh] max-h-[600px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col z-20 animate-slide-in-up origin-bottom-right">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
        <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-md">
                <LogoIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">GDS Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800"
          aria-label="Close chat"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-messages">
        {messages.map((msg, index) => (
          <ChatBubble key={index} message={msg} />
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-slate-200 dark:bg-slate-700 rounded-2xl rounded-bl-none px-4 py-3 max-w-xs inline-block">
                    <LoaderIcon className="animate-spin h-5 w-5 text-slate-500" />
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            className="flex-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder-slate-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800"
            aria-label="Send message"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};