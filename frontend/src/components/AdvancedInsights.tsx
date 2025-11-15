import React from 'react';

interface AdvancedInsightsProps {
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
}

export default function AdvancedInsights({
  sentiment,
  keyTopics,
  targetAudience,
  qualityScore,
  qualitySuggestions,
  qualityStrengths,
  qualityWeaknesses
}: AdvancedInsightsProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Sentiment Analysis */}
      {sentiment && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">😊 Sentiment Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Sentiment</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getSentimentColor(sentiment.sentiment)}`}>
                {sentiment.sentiment.charAt(0).toUpperCase() + sentiment.sentiment.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Confidence</p>
              <p className="text-lg font-semibold text-gray-800">
                {(sentiment.confidence * 100).toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Tone</p>
              <p className="text-gray-800 font-medium">{sentiment.tone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Emotions</p>
              <div className="flex flex-wrap gap-2">
                {sentiment.emotions.map((emotion, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                    {emotion}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Topics */}
      {keyTopics && keyTopics.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🏷️ Key Topics</h2>
          <div className="flex flex-wrap gap-2">
            {keyTopics.map((topic, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
              >
                #{topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Target Audience */}
      {targetAudience && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">🎯 Target Audience</h2>
          <p className="text-gray-700 leading-relaxed">{targetAudience}</p>
        </div>
      )}

      {/* Quality Analysis */}
      {qualityScore !== undefined && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">⭐ Post Quality Score</h2>
          <div className="mb-4">
            <div className="flex items-center gap-4">
              <span className={`text-4xl font-bold ${getScoreColor(qualityScore)}`}>
                {qualityScore}/10
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    qualityScore >= 8 ? 'bg-green-500' : qualityScore >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(qualityScore / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {qualityStrengths && qualityStrengths.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-green-700 mb-2">✅ Strengths</h3>
              <ul className="list-disc list-inside space-y-1">
                {qualityStrengths.map((strength, idx) => (
                  <li key={idx} className="text-gray-700 text-sm">{strength}</li>
                ))}
              </ul>
            </div>
          )}

          {qualityWeaknesses && qualityWeaknesses.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-red-700 mb-2">⚠️ Areas for Improvement</h3>
              <ul className="list-disc list-inside space-y-1">
                {qualityWeaknesses.map((weakness, idx) => (
                  <li key={idx} className="text-gray-700 text-sm">{weakness}</li>
                ))}
              </ul>
            </div>
          )}

          {qualitySuggestions && qualitySuggestions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-blue-700 mb-2">💡 Suggestions</h3>
              <ul className="list-disc list-inside space-y-1">
                {qualitySuggestions.map((suggestion, idx) => (
                  <li key={idx} className="text-gray-700 text-sm">{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

