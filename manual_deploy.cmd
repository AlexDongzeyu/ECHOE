@echo off
echo 🚀 Manual Deployment - Light in Silence
echo.
echo Step 1: Building the application...
echo.
pause
npm run build
echo.
echo Step 2: Deploying to Cloudflare Workers...
echo.
pause  
npx wrangler deploy
echo.
echo ✅ Deployment should be complete!
echo.
echo Your website: https://light-in-silence.alexdong0414.workers.dev
echo.
echo Please wait 2-3 minutes for global propagation, then refresh your browser.
echo.
pause 