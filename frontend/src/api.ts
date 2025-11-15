const API_BASE_URL = '/api';

export interface ProcessResponse {
  success: boolean;
  data: {
    id: number;
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
  };
}

export interface HistoryItem {
  id: number;
  originalPost: string;
  summary: string;
  mainIdea: string;
  actionableSteps: string[];
  projectIdeas: string[];
  timestamp: string;
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

export interface HistoryResponse {
  success: boolean;
  data: HistoryItem[];
}

/**
 * Process a LinkedIn post
 */
export async function processPost(postText: string): Promise<ProcessResponse> {
  const response = await fetch(`${API_BASE_URL}/process`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ postText }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to process post');
  }

  return response.json();
}

/**
 * Get processing history
 */
export async function getHistory(limit: number = 10): Promise<HistoryResponse> {
  const response = await fetch(`${API_BASE_URL}/history?limit=${limit}`);

  if (!response.ok) {
    throw new Error('Failed to fetch history');
  }

  return response.json();
}

/**
 * Delete a specific post from history
 */
export async function deleteHistoryItem(id: number): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/history/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete post');
  }

  return response.json();
}

/**
 * Delete all history
 */
export async function deleteAllHistory(): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/history`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete history');
  }

  return response.json();
}

