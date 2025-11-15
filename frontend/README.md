# Frontend - LinkedIn Insight Agent

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Features

- **React + TypeScript** - Type-safe component development
- **Tailwind CSS** - Modern, responsive styling
- **Vite** - Fast development and build tooling
- **Local Storage** - Saves processed posts in browser
- **API Integration** - Connects to backend for AI processing

## Components

- `App.tsx` - Main application component with tab navigation
- `InputBox.tsx` - Text input for LinkedIn posts
- `ResultCard.tsx` - Displays generated insights
- `History.tsx` - Shows processing history

## API Client

The `api.ts` file handles all backend communication:
- `processPost()` - Sends post to backend for processing
- `getHistory()` - Fetches processing history

