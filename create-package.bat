@echo off
echo ========================================
echo  AI Content Generator - CodeCanyon Package Creator
echo ========================================
echo.

REM Step 1: Clean up
echo [1/6] Cleaning up old files...
if exist "dist" rmdir /s /q dist
if exist "ai-content-generator.zip" del ai-content-generator.zip
echo Done!
echo.

REM Step 2: Create dist folder structure
echo [2/6] Creating package structure...
mkdir dist\ai-content-generator
mkdir dist\ai-content-generator\client
mkdir dist\ai-content-generator\server
mkdir dist\ai-content-generator\docs
echo Done!
echo.

REM Step 3: Copy files
echo [3/6] Copying files...

REM Copy client (excluding node_modules)
xcopy /E /I /Y client\src dist\ai-content-generator\client\src
xcopy /E /I /Y client\public dist\ai-content-generator\client\public
copy client\package.json dist\ai-content-generator\client\
copy client\package-lock.json dist\ai-content-generator\client\
copy client\tailwind.config.js dist\ai-content-generator\client\
copy client\postcss.config.js dist\ai-content-generator\client\

REM Copy server
xcopy /E /I /Y server dist\ai-content-generator\server

REM Copy docs
xcopy /E /I /Y docs dist\ai-content-generator\docs

REM Copy root files
copy .env.example dist\ai-content-generator\
copy .gitignore dist\ai-content-generator\
copy install.bat dist\ai-content-generator\
copy install.sh dist\ai-content-generator\
copy LICENSE dist\ai-content-generator\
copy package.json dist\ai-content-generator\
copy package-lock.json dist\ai-content-generator\
copy README.md dist\ai-content-generator\

echo Done!
echo.

REM Step 4: Create ZIP using PowerShell
echo [4/6] Creating ZIP package...
powershell -Command "Compress-Archive -Path 'dist\ai-content-generator' -DestinationPath 'ai-content-generator.zip' -Force"
echo Done!
echo.

REM Step 5: Cleanup dist folder
echo [5/6] Cleaning up temp files...
rmdir /s /q dist
echo Done!
echo.

REM Step 6: Show result
echo [6/6] Verifying package...
if exist "ai-content-generator.zip" (
    echo.
    echo ========================================
    echo  ✅ SUCCESS! Package created:
    echo  ai-content-generator.zip
    echo ========================================
    echo.
    powershell -Command "(Get-Item 'ai-content-generator.zip').Length / 1MB" 
    echo MB
) else (
    echo.
    echo ❌ ERROR: ZIP file was not created!
    echo.
)

echo.
echo NEXT STEPS:
echo 1. Take screenshots (see codecanyon/screenshots-guide.md)
echo 2. Deploy demo site to Railway
echo 3. Upload to CodeCanyon
echo.
pause
