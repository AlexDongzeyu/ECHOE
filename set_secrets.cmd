@echo off
echo 🔐 Setting up Cloudflare Workers secrets...
echo.
echo Please enter your JWT secret (a random secure string):
npx wrangler secret put JWT_SECRET
echo.
echo Please enter your Google Gemini API key:
npx wrangler secret put GEMINI_API_KEY
echo.
echo ✅ Secrets configured successfully!
pause 