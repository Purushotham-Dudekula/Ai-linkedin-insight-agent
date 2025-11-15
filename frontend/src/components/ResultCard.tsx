import React from 'react';
import AdvancedInsights from './AdvancedInsights';
import ExportButton from './ExportButton';

interface ResultCardProps {
  summary: string;
  mainIdea: string;
  actionableSteps: string[];
  projectIdeas: string[];
  sentiment?: {
    sentiment: string;
    confidence: number;
    emotions: string[];
    tone: string;
  };
  keyTopics?: string[];
  targetAudience?: string;
  qualityScore?: number;
  qualitySuggestions?: string[];
  qualityStrengths?: string[];
  qualityWeaknesses?: string[];
  originalPost?: string;
}

export default function ResultCard({
  summary,
  mainIdea,
  actionableSteps,
  projectIdeas,
  sentiment,
  keyTopics,
  targetAudience,
  qualityScore,
  qualitySuggestions,
  qualityStrengths,
  qualityWeaknesses,
  originalPost
}: ResultCardProps) {
  const exportData = {
    summary,
    mainIdea,
    actionableSteps,
    projectIdeas,
    sentiment,
    keyTopics,
    targetAudience,
    qualityScore,
    qualitySuggestions,
    originalPost
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <ExportButton data={exportData} />
      {/* Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">📝 Summary</h2>
        <p className="text-gray-700 leading-relaxed">{summary}</p>
      </div>

      {/* Main Idea */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">💡 Main Idea</h2>
        <p className="text-gray-700 leading-relaxed">{mainIdea}</p>
      </div>

      {/* Actionable Steps */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">✅ Actionable Steps</h2>
        <ol className="list-decimal list-inside space-y-2">
          {actionableSteps.map((step, index) => (
            <li key={index} className="text-gray-700 leading-relaxed">
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Project Ideas */}
      {projectIdeas && projectIdeas.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">🚀 Project Ideas</h2>
          <ul className="list-disc list-inside space-y-2">
            {projectIdeas.map((idea, index) => (
              <li key={index} className="text-gray-700 leading-relaxed">
                {idea}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Advanced Insights */}
      <AdvancedInsights
        sentiment={sentiment}
        keyTopics={keyTopics}
        targetAudience={targetAudience}
        qualityScore={qualityScore}
        qualitySuggestions={qualitySuggestions}
        qualityStrengths={qualityStrengths}
        qualityWeaknesses={qualityWeaknesses}
      />
    </div>
  );
}

