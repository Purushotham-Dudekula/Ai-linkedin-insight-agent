# 🤖 AI LinkedIn Post → Actionable Insights Agent

Transform any LinkedIn post into structured, actionable insights using AI. This full-stack application processes LinkedIn posts through a multi-step AI pipeline to generate summaries, main ideas, actionable steps, and project suggestions.

## OUTPUT SCREENS
<img width="1917" height="779" alt="Screenshot 2026-02-25 115713" src="https://github.com/user-attachments/assets/e7ce8b29-ef3d-4ae9-94f9-ff9fa1c3bd17" />
<img width="1919" height="807" alt="Screenshot 2026-02-25 120149" src="https://github.com/user-attachments/assets/aeac4cf3-c479-433f-ab89-649097cc5ce2" />

<img width="1854" height="678" alt="Screenshot 2026-02-25 121051" src="https://github.com/user-attachments/assets/542abdb4-3c75-4517-8994-4b02b703bcd3" />

<img width="536" height="824" alt="Screenshot 2026-02-25 121146" src="https://github.com/user-attachments/assets/921aae76-6693-457f-9b5c-8efa4fac989c" />


<img width="1879" height="544" alt="Screenshot 2026-02-25 121319" src="https://github.com/user-attachments/assets/68166185-ba10-4a71-8710-25f935367de7" />



<img width="1865" height="629" alt="Screenshot 2026-02-25 115946" src="https://github.com/user-attachments/assets/0a7f480f-0929-43b0-b8c2-85655a106d80" />


<img width="510" height="828" alt="Screenshot 2026-02-25 120014" src="https://github.com/user-attachments/assets/b1fb802a-f0bf-46ca-b4b0-c6cc483d5100" />

<img width="1863" height="530" alt="Screenshot 2026-02-25 120044" src="https://github.com/user-attachments/assets/ac760ed0-1bb2-418c-9ecc-b40c71d26173" />

<img width="516" height="793" alt="Screenshot 2026-02-25 120106" src="https://github.com/user-attachments/assets/fcd65660-6b71-4ca0-b72a-b197cd6d3298" />

<img width="1869" height="484" alt="Screenshot 2026-02-25 120124" src="https://github.com/user-attachments/assets/9e707a85-ad0b-4a2a-8f3c-52e51a9c1c47" />









## ✨ Features

- **Short Summary** - Concise 2-3 sentence summary
- **Main Idea** - Extracted core message
- **Actionable Steps** - 3 prioritized actions you can take
- **Project Ideas** - Creative project suggestions inspired by the post
- **Advanced Insights** - Sentiment analysis, key topics, target audience, quality score
- **History Storage** - All processed posts saved locally (backend + localStorage)
- **Delete History** - Delete individual posts or clear all history
- **URL Support** - Process LinkedIn post URLs directly
- **User Authentication** - Login and signup functionality
- **Export Functionality** - Export insights as JSON or text

## 🚀 Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS + Vite
- **Backend:** Node.js + Express
- **AI:** AI-powered insights (configurable)
- **Storage:** File-based JSON database (no external DB required)

## 📂 Project Structure

```
ai-linkedin-insight-agent/
├── backend/
│   ├── server.js              # Express server
│   ├── routes/process.js      # API routes
│   ├── services/julesService.js  # AI service
│   ├── utils/fileDB.js        # File-based database
│   └── data/                  # JSON storage
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main component
│   │   ├── components/        # React components
│   │   └── api.ts             # API client
│   └── public/
│
└── README.md                  # This file
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+ installed
- API key (optional - app works in fallback mode without it)

### Backend Setup

```bash
cd backend
npm install
```

Configure your environment variables in `backend/.env` file.

Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

```bash
cd frontend
npm install
```

Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📖 Usage

### Quick Start (Both Servers)

```bash
# From project root
npm start
```

This will start both backend and frontend servers concurrently.

### Manual Start

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open** `http://localhost:5173` in your browser
4. **Sign up / Login** to access the application
5. **Paste** any LinkedIn post text or URL into the input area
6. **Click** "Process Post" to generate insights
7. **View** results: Summary, Main Idea, Actionable Steps, Project Ideas, and Advanced Insights
8. **Check History** tab to see all previously processed posts
9. **Delete** individual posts or clear all history as needed

## 🔌 API Endpoints

- `POST /api/process` - Process a LinkedIn post and generate insights
- `GET /api/history` - Get processing history
- `DELETE /api/history/:id` - Delete a specific post
- `DELETE /api/history` - Delete all history
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login with credentials

## 💾 Data Storage

- **Backend:** All processed posts are saved in `backend/data/processedPosts.json`
- **Frontend:** Recent posts are cached in browser `localStorage`

## 🎯 Why This Project is Impressive

- ✅ **Real AI Agent Pipeline** - Multi-step reasoning with structured prompts
- ✅ **Full Stack** - Complete React frontend + Node.js backend
- ✅ **No Complex Setup** - File-based storage, no database or cloud required
- ✅ **Production Ready** - Clean code, error handling, TypeScript
- ✅ **Perfect for Portfolio** - Demonstrates AI integration, full-stack skills

## 🧪 Development

### Backend
- Runs on Node.js with Express
- Uses file-based JSON database for simplicity
- AI-powered processing with configurable providers

### Frontend
- Built with Vite for fast development
- React with TypeScript for type safety
- Tailwind CSS for beautiful, responsive UI
- Automatic API proxying to backend

## 📝 Notes

- Configure your environment variables in `backend/.env`
- The application stores data locally - no external database needed!

## 🤝 Contributing

This is a portfolio project. Feel free to fork and customize for your own use!

## 📄 License

MIT

---

Built with ❤️ for showcasing AI and full-stack development skills.

