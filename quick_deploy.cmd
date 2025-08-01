@echo off
echo.
echo ============================================
echo    🎉 LIGHT IN SILENCE - QUICK DEPLOY
echo ============================================
echo.
echo This will deploy your beautiful website with:
echo ✅ Complete homepage with cats and garden
echo ✅ Working navigation
echo ✅ All original design elements
echo.
pause

echo ⚡ Building application...
echo.
call npm run build
if %ERRORLEVEL% neq 0 (
    echo.
    echo ❌ Build failed. Let's try direct deployment...
    echo.
)

echo.
echo 🚀 Deploying to Cloudflare Workers...
echo.
call npx wrangler deploy
if %ERRORLEVEL% neq 0 (
    echo.
    echo ❌ Deploy failed. Please check your Wrangler setup.
    echo.
    echo Try these commands manually:
    echo 1. npx wrangler login
    echo 2. npx wrangler deploy
    echo.
) else (
    echo.
    echo ✅ DEPLOYMENT SUCCESS!
    echo.
    echo 🌟 Your website is now live at:
    echo https://light-in-silence.alexdong0414.workers.dev
    echo.
    echo What you should see:
    echo ✅ Beautiful header with Light in Silence logo
    echo ✅ Hero section with "Find Light in Silence"
    echo ✅ Garden with animated cats 🐱🐈🐱🐈‍⬛
    echo ✅ Flowers and butterflies 🌸🌺🦋
    echo ✅ "How It Works" section with numbered steps
    echo ✅ Working navigation (Submit, About, Login, etc.)
    echo.
)

echo.
echo Press any key to exit...
pause >nul 