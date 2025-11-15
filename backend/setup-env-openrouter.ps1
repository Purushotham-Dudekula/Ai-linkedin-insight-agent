# PowerShell script to setup .env file with OpenRouter API key
# Usage: .\setup-env-openrouter.ps1

$openRouterKey = "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"

Write-Host "Setting up .env file with OpenRouter API..." -ForegroundColor Cyan
Write-Host ""

# Create .env file with OpenRouter configuration
$envContent = @"
PORT=3001
JULES_API_KEY=$openRouterKey
# Using OpenRouter API (OpenAI-compatible)
# JULES_API_URL defaults to: https://openrouter.ai/api/v1/chat/completions
"@

Set-Content -Path ".env" -Value $envContent -Encoding UTF8

Write-Host "SUCCESS - .env file updated with OpenRouter API key!" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  - API Key: OpenRouter key set" -ForegroundColor Green
Write-Host "  - API URL: https://openrouter.ai/api/v1/chat/completions" -ForegroundColor Green
Write-Host "  - Model: openai/gpt-4" -ForegroundColor Green
Write-Host ""
Write-Host "The service will still be called 'Jules API' but uses OpenRouter under the hood." -ForegroundColor Cyan

