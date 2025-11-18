import React from 'react';

// Fix: The ChatBubble component was part of the deprecated chatbot feature and used a removed type.
// The component is stubbed out to resolve build errors.
interface ChatBubbleProps {
  // Using 'any' since ChatMessage type is removed.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: any;
}

export const ChatBubble: React.FC<ChatBubbleProps> = () => {
  return null;
};
