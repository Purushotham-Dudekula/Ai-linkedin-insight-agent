import React, { useState, useEffect } from 'react';
import InputBox from './components/InputBox';
import ResultCard from './components/ResultCard';
import History from './components/History';
import Login from './components/Login';
import Signup from './components/Signup';
import { processPost, ProcessResponse } from './api';

type Tab = 'process' | 'history';
type AuthView = 'login' | 'signup' | null;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>('process');
  const [postText, setPostText] = useState('');
  const [result, setResult] = useState<ProcessResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
      setAuthView(null);
    } else {
      setAuthView('login');
    }
  }, []);

  const handleLogin = (token: string, userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
    setAuthView(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setAuthView('login');
    setResult(null);
    setPostText('');
  };

  const handleProcess = async () => {
    if (!postText.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Check if input is a URL
      const isUrl = (str: string) => {
        try {
          new URL(str);
          return true;
        } catch {
          return false;
        }
      };

      const requestBody = isUrl(postText.trim())
        ? { postUrl: postText.trim() }
        : { postText: postText.trim() };

      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process post');
      }

      if (data.success) {
        setResult(data.data);
        
        // Save to localStorage
        const existingHistory = JSON.parse(
          localStorage.getItem('linkedinInsightHistory') || '[]'
        );
        const newItem = {
          ...data.data,
          originalPost: postText,
          timestamp: new Date().toISOString()
        };
        existingHistory.unshift(newItem);
        localStorage.setItem(
          'linkedinInsightHistory',
          JSON.stringify(existingHistory.slice(0, 10))
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process post');
      console.error('Error processing post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Show login/signup if not authenticated
  if (!isAuthenticated) {
    if (authView === 'signup') {
      return <Signup onSignup={handleLogin} onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <Login onLogin={handleLogin} onSwitchToSignup={() => setAuthView('signup')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Welcome, {user?.name || user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Logout
            </button>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🤖 AI LinkedIn Insight Agent
          </h1>
          <p className="text-gray-600">
            Transform LinkedIn posts into actionable insights
          </p>
        </header>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
            <button
              onClick={() => setActiveTab('process')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'process'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Process Post
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              History
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'process' ? (
          <div className="space-y-8">
            <InputBox
              value={postText}
              onChange={setPostText}
              onProcess={handleProcess}
              isLoading={isLoading}
            />

            {error && (
              <div className="w-full max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">❌ {error}</p>
              </div>
            )}

            {result && (
              <div className="mt-8">
                <ResultCard
                  summary={result.summary}
                  mainIdea={result.mainIdea}
                  actionableSteps={result.actionableSteps}
                  projectIdeas={result.projectIdeas}
                  sentiment={result.sentiment}
                  keyTopics={result.keyTopics}
                  targetAudience={result.targetAudience}
                  qualityScore={result.qualityScore}
                  qualitySuggestions={result.qualitySuggestions}
                  qualityStrengths={result.qualityStrengths}
                  qualityWeaknesses={result.qualityWeaknesses}
                  originalPost={postText}
                />
              </div>
            )}
          </div>
        ) : (
          <History />
        )}
      </div>
    </div>
  );
}

export default App;

