# 🚀 Vercel Deployment Guide

## Prerequisites
- Frontend deployed on Vercel
- Backend deployed on Render (or another hosting service)

## Step 1: Get Your Backend URL

Your backend should be deployed on Render (or another service). Note the URL, for example:
- `https://your-app-name.onrender.com`

## Step 2: Configure Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Name**: `VITE_API_URL`
   - **Value**: Your Render backend URL (e.g., `https://your-app-name.onrender.com`)
   - **Environment**: Select all (Production, Preview, Development)

## Step 3: Redeploy

After adding the environment variable:
1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Select **Redeploy**

Or simply push a new commit to trigger a new deployment.

## Step 4: Verify

1. Open your Vercel deployment URL
2. Try logging in
3. If you see errors, check the browser console for API connection issues

## Troubleshooting

### Error: "Unexpected token 'T', 'The page c'... is not valid JSON"
This means the frontend cannot reach your backend API. Check:
- ✅ `VITE_API_URL` is set correctly in Vercel
- ✅ Your Render backend is running and accessible
- ✅ The backend URL doesn't have a trailing slash
- ✅ CORS is configured on your backend to allow requests from your Vercel domain

### Backend CORS Configuration

Make sure your backend (on Render) allows requests from your Vercel domain. In your backend code, add:

```javascript
// Example for Express.js
app.use(cors({
  origin: [
    'https://your-vercel-app.vercel.app',
    'http://localhost:5173' // for local development
  ],
  credentials: true
}));
```

## Environment Variables Summary

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Your backend API URL | `https://your-app.onrender.com` |

**Note**: Do NOT include `/api` at the end. The code will append the endpoint paths automatically.
