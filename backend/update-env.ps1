# PowerShell script to update .env file with Jules API key
# Usage: .\update-env.ps1

$apiKey = "AQ.Ab8RN6JdekYX2IDhRZL8Ut8asnzJpqXwpdnFkQdzO9TBfdG3vw"

# Try different possible endpoints
$endpoints = @(
    "https://api.openai.com/v1/chat/completions",
    "https://api.jules.ai/v1/chat/completions",
    "https://jules.ai/api/v1/chat/completions"
)

Write-Host "Updating .env file..." -ForegroundColor Cyan

$envContent = @"
PORT=3001
JULES_API_KEY=$apiKey
JULES_API_URL=https://api.openai.com/v1/chat/completions
"@

Set-Content -Path ".env" -Value $envContent -Encoding UTF8

Write-Host "SUCCESS - .env file updated!" -ForegroundColor Green
Write-Host "Using endpoint: https://api.openai.com/v1/chat/completions" -ForegroundColor Yellow
Write-Host ""
Write-Host "If this doesn't work, you may need to:" -ForegroundColor Yellow
Write-Host "1. Check your Jules API documentation for the correct endpoint" -ForegroundColor Yellow
Write-Host "2. Update JULES_API_URL in .env file manually" -ForegroundColor Yellow

