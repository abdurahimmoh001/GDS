import React from 'react';

// Fix: The Chatbot component was using types and services that have been removed.
// The component is stubbed out to resolve build errors, as the feature is deprecated.
interface ChatbotProps {
  onClose: () => void;
}

export const Chatbot: React.FC<ChatbotProps> = () => {
  return null;
};
