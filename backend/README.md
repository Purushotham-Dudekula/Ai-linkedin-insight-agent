# Backend - LinkedIn Insight Agent

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
- Copy `.env` and add your Jules API key
- Update `JULES_API_KEY` with your actual API key

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### POST `/api/process`
Process a LinkedIn post and generate insights.

**Request:**
```json
{
  "postText": "Your LinkedIn post content here..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "summary": "...",
    "mainIdea": "...",
    "actionableSteps": ["...", "...", "..."],
    "projectIdeas": ["...", "..."]
  }
}
```

### GET `/api/history`
Get recent processed posts.

**Query Parameters:**
- `limit` (optional): Number of posts to return (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "originalPost": "...",
      "summary": "...",
      "mainIdea": "...",
      "actionableSteps": [...],
      "projectIdeas": [...],
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Data Storage

All processed posts are stored in `data/processedPosts.json` as a JSON array.

