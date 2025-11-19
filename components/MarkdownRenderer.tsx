import React from 'react';

interface MarkdownRendererProps {
  text: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text }) => {
  if (!text) return null;

  // Split by one or more newlines to create paragraphs
  const paragraphs = text.split(/\n+/).filter(p => p.trim() !== '');

  const renderParagraph = (paragraph: string) => {
    // Split by the bold delimiter, keeping the delimiter
    const parts = paragraph.split(/(\*[^*]+\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        // Render the part inside the asterisks as bold
        return <strong key={index}>{part.slice(1, -1)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-4">
      {paragraphs.map((p, i) => (
        <p key={i}>
          {renderParagraph(p)}
        </p>
      ))}
    </div>
  );
};