// Use environment variable for backend URL, fallback to relative path for local dev
// IMPORTANT: Set VITE_API_URL in Vercel environment variables to your Render backend URL
// Example: https://your-app-name.onrender.com
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper function to handle API errors with better messages
async function handleApiResponse(response: Response) {
  const contentType = response.headers.get('content-type');
  
  // If response is not JSON, it's likely an HTML error page (404, 500, etc.)
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    // Check if it's an HTML error page
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html') || text.includes('The page')) {
      throw new Error(
        `Backend API not found. Please set VITE_API_URL environment variable in Vercel to your Render backend URL.\n` +
        `Received: ${text.substring(0, 200)}`
      );
    }
    throw new Error(`Invalid response format. Expected JSON but got: ${text.substring(0, 100)}`);
  }
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || `API request failed with status ${response.status}`);
  }
  
  return data;
}

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
    let error;
    try {
      error = await response.json();
    } catch {
      throw new Error(`Failed to process post: ${response.status} ${response.statusText}`);
    }
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
    let error;
    try {
      error = await response.json();
    } catch {
      throw new Error(`Failed to fetch history: ${response.status} ${response.statusText}`);
    }
    throw new Error(error.message || 'Failed to fetch history');
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
    let error;
    try {
      error = await response.json();
    } catch {
      throw new Error(`Failed to delete post: ${response.status} ${response.statusText}`);
    }
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
    let error;
    try {
      error = await response.json();
    } catch {
      throw new Error(`Failed to delete history: ${response.status} ${response.statusText}`);
    }
    throw new Error(error.message || 'Failed to delete history');
  }

  return response.json();
}

/**
 * Login user
 */
export async function login(email: string, password: string): Promise<{ success: boolean; data: { token: string; user: any } }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    return await handleApiResponse(response);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to connect to backend API. Please check your VITE_API_URL configuration.');
  }
}

/**
 * Signup user
 */
export async function signup(name: string, email: string, password: string): Promise<{ success: boolean; data: { token: string; user: any } }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    return await handleApiResponse(response);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to connect to backend API. Please check your VITE_API_URL configuration.');
  }
}

