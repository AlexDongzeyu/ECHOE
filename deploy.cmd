@echo off
echo 🚀 Deploying Light in Silence to Cloudflare Workers...
echo.
echo Building the application...
npm run build
echo.
echo Deploying to global edge network...
npx wrangler deploy
echo.
echo ✅ Deployment complete!
echo.
echo Your website is now live at:
echo https://light-in-silence.your-subdomain.workers.dev
echo.
pause 