import React from 'react';

interface ExportButtonProps {
  data: {
    summary: string;
    mainIdea: string;
    actionableSteps: string[];
    projectIdeas: string[];
    sentiment?: any;
    keyTopics?: string[];
    targetAudience?: string;
    qualityScore?: number;
    qualitySuggestions?: string[];
    originalPost?: string;
  };
}

export default function ExportButton({ data }: ExportButtonProps) {
  const exportToJSON = () => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkedin-insights-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToText = () => {
    let text = '=== LinkedIn Post Insights ===\n\n';
    
    if (data.originalPost) {
      text += `Original Post:\n${data.originalPost}\n\n`;
    }
    
    text += `Summary:\n${data.summary}\n\n`;
    text += `Main Idea:\n${data.mainIdea}\n\n`;
    
    if (data.actionableSteps && data.actionableSteps.length > 0) {
      text += `Actionable Steps:\n`;
      data.actionableSteps.forEach((step, idx) => {
        text += `${idx + 1}. ${step}\n`;
      });
      text += '\n';
    }
    
    if (data.projectIdeas && data.projectIdeas.length > 0) {
      text += `Project Ideas:\n`;
      data.projectIdeas.forEach((idea, idx) => {
        text += `- ${idea}\n`;
      });
      text += '\n';
    }
    
    if (data.sentiment) {
      text += `Sentiment: ${data.sentiment.sentiment} (${(data.sentiment.confidence * 100).toFixed(0)}% confidence)\n`;
      text += `Tone: ${data.sentiment.tone}\n`;
      text += `Emotions: ${data.sentiment.emotions.join(', ')}\n\n`;
    }
    
    if (data.keyTopics && data.keyTopics.length > 0) {
      text += `Key Topics: ${data.keyTopics.join(', ')}\n\n`;
    }
    
    if (data.targetAudience) {
      text += `Target Audience: ${data.targetAudience}\n\n`;
    }
    
    if (data.qualityScore !== undefined) {
      text += `Quality Score: ${data.qualityScore}/10\n`;
      if (data.qualitySuggestions && data.qualitySuggestions.length > 0) {
        text += `Suggestions:\n`;
        data.qualitySuggestions.forEach((suggestion) => {
          text += `- ${suggestion}\n`;
        });
      }
    }
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkedin-insights-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2 justify-end mb-4">
      <button
        onClick={exportToJSON}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
      >
        📥 Export JSON
      </button>
      <button
        onClick={exportToText}
        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
      >
        📄 Export Text
      </button>
    </div>
  );
}

