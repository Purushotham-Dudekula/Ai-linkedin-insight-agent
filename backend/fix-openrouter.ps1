# Fix OpenRouter API Configuration
Write-Host "=== Fixing OpenRouter API Configuration ===" -ForegroundColor Cyan
Write-Host ""

# The OpenRouter API key from the error message
$openRouterKey = "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"

Write-Host "Updating .env file with OpenRouter key..." -ForegroundColor Yellow

$envContent = @"
PORT=3001
JULES_API_KEY=$openRouterKey
# OpenRouter API - auto-detected by key format (sk-or-v1)
# The code will automatically use OpenRouter endpoint when it detects this key format
"@

Set-Content -Path ".env" -Value $envContent -Encoding UTF8

Write-Host "SUCCESS! .env file updated!" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  - API Key: OpenRouter key (sk-or-v1...)" -ForegroundColor Green
Write-Host "  - Endpoint: Will auto-detect to https://openrouter.ai/api/v1/chat/completions" -ForegroundColor Green
Write-Host "  - Model: openai/gpt-3.5-turbo" -ForegroundColor Green
Write-Host ""
Write-Host "The code will automatically:" -ForegroundColor Cyan
Write-Host "  1. Detect the OpenRouter key format (sk-or-v1)" -ForegroundColor White
Write-Host "  2. Use OpenRouter endpoint" -ForegroundColor White
Write-Host "  3. Add required OpenRouter headers" -ForegroundColor White
Write-Host "  4. Use correct model format (openai/gpt-3.5-turbo)" -ForegroundColor White
Write-Host ""
Write-Host "Restart the backend server for changes to take effect!" -ForegroundColor Yellow

