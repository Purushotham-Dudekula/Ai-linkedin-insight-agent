# PowerShell script to setup .env file with just the API key
# Usage: .\setup-env.ps1

$apiKey = "AQ.Ab8RN6JdekYX2IDhRZL8Ut8asnzJpqXwpdnFkQdzO9TBfdG3vw"

Write-Host "Setting up .env file..." -ForegroundColor Cyan
Write-Host ""

# Create .env file with just the API key
# JULES_API_URL is optional - will use OpenAI endpoint by default
$envContent = @"
PORT=3001
JULES_API_KEY=$apiKey
# JULES_API_URL is optional - defaults to OpenAI endpoint
# Uncomment and set if you need a different endpoint:
# JULES_API_URL=https://api.openai.com/v1/chat/completions
"@

Set-Content -Path ".env" -Value $envContent -Encoding UTF8

Write-Host "SUCCESS - .env file created!" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  - API Key: Set" -ForegroundColor Green
Write-Host "  - API URL: Will use OpenAI endpoint (https://api.openai.com/v1/chat/completions)" -ForegroundColor Green
Write-Host ""
Write-Host "If your API key works with a different endpoint, edit .env and set JULES_API_URL" -ForegroundColor Yellow

