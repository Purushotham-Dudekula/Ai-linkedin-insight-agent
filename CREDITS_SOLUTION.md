# 💳 API Credits Solution

## Current Issue

The OpenRouter API key doesn't have any credits. The error message indicates:
```
"Insufficient credits. This account never purchased credits."
```

## Solutions

### Option 1: Add Credits to OpenRouter (Recommended)
1. Visit: https://openrouter.ai/settings/credits
2. Add credits to your account
3. The application will work immediately

### Option 2: Use a Different API Key
If you have another OpenRouter API key with credits:
1. Update `backend/.env` file
2. Change `JULES_API_KEY` to your new key
3. Restart the server

### Option 3: Use OpenAI Directly (If you have OpenAI credits)
1. Update `backend/.env`:
   ```
   JULES_API_KEY=your_openai_api_key
   JULES_API_URL=https://api.openai.com/v1/chat/completions
   ```
2. Update `backend/services/julesService.js`:
   - Change model from `openai/gpt-3.5-turbo` to `gpt-3.5-turbo`
3. Restart the server

### Option 4: Use a Free Alternative
For development/testing, you could use:
- Hugging Face Inference API (free tier available)
- Local LLM (Ollama, etc.)
- Other free AI APIs

## Current Configuration

- **Model**: `openai/gpt-3.5-turbo` (cheaper than gpt-4)
- **Max Tokens**: 300 per request
- **API Calls**: 3 core + 5 optional (with fallbacks)
- **Cost Optimization**: Additional features use defaults if API fails

## Cost Estimate

With gpt-3.5-turbo:
- ~$0.001-0.002 per post analysis
- Very affordable for testing

## Quick Fix

To test immediately, add $5-10 credits to OpenRouter:
1. Go to https://openrouter.ai/settings/credits
2. Add credits
3. Test again - it will work!

---

**Note**: The code is optimized to use minimal credits. Core features (summary, main idea, actionable steps) will always work. Additional features (sentiment, quality score) will use defaults if credits run out.

