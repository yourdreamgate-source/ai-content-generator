@echo off
echo ========================================
echo  AI Content Generator - CodeCanyon Package Creator
echo ========================================
echo.

REM Step 1: Clean up
echo [1/5] Cleaning up old files...
if exist "node_modules" rmdir /s /q node_modules
if exist "client\node_modules" rmdir /s /q client\node_modules
if exist "client\build" rmdir /s /q client\build
if exist "database.sqlite" del database.sqlite
if exist ".env" del .env
if exist "ai-content-generator.zip" del ai-content-generator.zip
echo Done!
echo.

REM Step 2: Install dependencies
echo [2/5] Installing dependencies...
call npm run install-all
echo Done!
echo.

REM Step 3: Build production
echo [3/5] Building production client...
call npm run build
echo Done!
echo.

REM Step 4: Clean node_modules again for packaging
echo [4/5] Removing node_modules for packaging...
rmdir /s /q node_modules
rmdir /s /q client\node_modules
echo Done!
echo.

REM Step 5: Create ZIP
echo [5/5] Creating ZIP package...
echo.
echo NOTE: Please manually create ZIP file with these contents:
echo.
echo ai-content-generator.zip
echo └── ai-content-generator/
echo     ├── client/
echo     ├── server/
echo     ├── docs/
echo     ├── .env.example
echo     ├── .gitignore
echo     ├── install.bat
echo     ├── install.sh
echo     ├── LICENSE
echo     ├── package.json
echo     └── README.md
echo.
echo DO NOT include:
echo - node_modules/
echo - .env (with real keys)
echo - database.sqlite
echo - .git/
echo - codecanyon/ folder
echo.
echo ========================================
echo  Package preparation complete!
echo ========================================
echo.
echo NEXT STEPS:
echo 1. Create ZIP manually (exclude codecanyon folder)
echo 2. Take screenshots (see codecanyon/screenshots-guide.md)
echo 3. Deploy demo site (see codecanyon/demo-setup.md)
echo 4. Upload to CodeCanyon
echo.
pause
