import React, { useEffect, useState } from 'react';
import { getHistory, deleteHistoryItem, deleteAllHistory, HistoryItem } from '../api';
import ResultCard from './ResultCard';

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load from backend first
      try {
        const response = await getHistory(10);
        if (response.success && response.data) {
          setHistory(response.data);
          // Also save to localStorage
          localStorage.setItem('linkedinInsightHistory', JSON.stringify(response.data));
        }
      } catch (apiError) {
        // Fallback to localStorage if API fails
        const localHistory = localStorage.getItem('linkedinInsightHistory');
        if (localHistory) {
          setHistory(JSON.parse(localHistory));
        }
      }
    } catch (err) {
      setError('Failed to load history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteHistoryItem(id);
      
      // Remove from local state
      setHistory(history.filter(item => item.id !== id));
      
      // Update localStorage
      const localHistory = JSON.parse(localStorage.getItem('linkedinInsightHistory') || '[]');
      const updatedHistory = localHistory.filter((item: HistoryItem) => item.id !== id);
      localStorage.setItem('linkedinInsightHistory', JSON.stringify(updatedHistory));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL history? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await deleteAllHistory();
      
      // Clear local state
      setHistory([]);
      
      // Clear localStorage
      localStorage.removeItem('linkedinInsightHistory');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto text-center py-8">
        <p className="text-gray-600">Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto text-center py-8">
        <p className="text-gray-600">No history yet. Process a post to see it here!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">📚 History</h2>
        <div className="flex gap-2">
          {history.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Delete All
            </button>
          )}
          <button
            onClick={loadHistory}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            Refresh
          </button>
        </div>
      </div>
      
      {history.map((item) => (
        <div key={item.id} className="border-t border-gray-200 pt-6 relative">
          <button
            onClick={() => handleDelete(item.id)}
            disabled={deletingId === item.id}
            className="absolute top-0 right-0 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
            title="Delete this post"
          >
            {deletingId === item.id ? 'Deleting...' : '🗑️ Delete'}
          </button>
          
          <div className="mb-4 pr-20">
            <p className="text-sm text-gray-500 mb-2">
              {new Date(item.timestamp).toLocaleString()}
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 italic">"{item.originalPost.substring(0, 200)}..."</p>
            </div>
          </div>
          <ResultCard
            summary={item.summary}
            mainIdea={item.mainIdea}
            actionableSteps={item.actionableSteps}
            projectIdeas={item.projectIdeas}
            sentiment={item.sentiment}
            keyTopics={item.keyTopics}
            targetAudience={item.targetAudience}
            qualityScore={item.qualityScore}
            qualitySuggestions={item.qualitySuggestions}
            qualityStrengths={item.qualityStrengths}
            qualityWeaknesses={item.qualityWeaknesses}
            originalPost={item.originalPost}
          />
        </div>
      ))}
    </div>
  );
}

