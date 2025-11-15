import React, { useState } from 'react';

interface InputBoxProps {
  value: string;
  onChange: (value: string) => void;
  onProcess: () => void;
  isLoading: boolean;
}

export default function InputBox({ value, onChange, onProcess, isLoading }: InputBoxProps) {
  const [inputType, setInputType] = useState<'text' | 'url'>('text');

  const isURL = (str: string) => {
    try {
      const url = new URL(str);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const detectedType = value.trim() && isURL(value.trim()) ? 'url' : 'text';

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="post-input" className="block text-sm font-medium text-gray-700">
            {inputType === 'url' ? 'LinkedIn Post URL' : 'Paste LinkedIn Post'}
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setInputType('text')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                inputType === 'text'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Text
            </button>
            <button
              type="button"
              onClick={() => setInputType('url')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                inputType === 'url'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              URL
            </button>
          </div>
        </div>

        {inputType === 'url' ? (
          <input
            id="post-input"
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://www.linkedin.com/posts/..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        ) : (
          <textarea
            id="post-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste your LinkedIn post text here or switch to URL mode..."
            className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isLoading}
          />
        )}

        {detectedType === 'url' && inputType === 'text' && value.trim() && (
          <p className="mt-2 text-sm text-blue-600">
            💡 Detected URL - Switch to URL mode for better processing
          </p>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={onProcess}
            disabled={isLoading || !value.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? 'Processing...' : 'Process Post'}
          </button>
        </div>
      </div>
    </div>
  );
}

