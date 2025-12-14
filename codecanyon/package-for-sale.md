# How to Package for CodeCanyon Sale

Follow these steps to create your final ZIP file for CodeCanyon submission.

## Step 1: Clean Up

Delete these folders/files if they exist:
```
- node_modules/
- client/node_modules/
- client/build/
- database.sqlite
- .env (keep .env.example)
- .git/
- any .log files
```

## Step 2: Test Installation

Before packaging, test a fresh install:
```bash
# Delete node_modules
rmdir /s /q node_modules
rmdir /s /q client\node_modules

# Fresh install
npm run install-all

# Test it works
npm run dev
```

## Step 3: Build Production

```bash
npm run build
```

This creates `client/build/` folder.

## Step 4: Create ZIP Structure

Your ZIP should contain:
```
ai-content-generator.zip
└── ai-content-generator/
    ├── client/
    │   ├── public/
    │   ├── src/
    │   ├── package.json
    │   ├── postcss.config.js
    │   └── tailwind.config.js
    ├── server/
    │   ├── database/
    │   ├── middleware/
    │   ├── routes/
    │   └── index.js
    ├── docs/
    │   ├── DOCUMENTATION.md
    │   └── CHANGELOG.md
    ├── .env.example
    ├── .gitignore
    ├── install.bat
    ├── install.sh
    ├── LICENSE
    ├── package.json
    └── README.md
```

## Step 5: Create ZIP (Windows)

```powershell
# Navigate to parent folder of ai-content-generator
cd ..

# Create ZIP excluding unwanted files
Compress-Archive -Path ai-content-generator -DestinationPath ai-content-generator.zip -Force
```

Or use 7-Zip:
1. Right-click `ai-content-generator` folder
2. Select 7-Zip > Add to archive
3. Choose ZIP format
4. Name it `ai-content-generator.zip`

## Step 6: Verify ZIP

1. Extract to a new location
2. Run `npm run install-all`
3. Add your .env file
4. Run `npm run dev`
5. Test all features work

## Files to Upload to CodeCanyon

### Main File
- `ai-content-generator.zip` (your packaged code)

### Screenshots (from codecanyon/screenshots/)
- `thumbnail.png` (590x300) - REQUIRED
- `preview.png` (590x300) - REQUIRED
- Additional screenshots (at least 3 more)

### Documentation
Already included in the ZIP in `/docs/` folder

## CodeCanyon Upload Process

1. Go to https://codecanyon.net/upload
2. Select category: Scripts & Code
3. Upload main file (ZIP)
4. Upload thumbnail and preview images
5. Upload additional screenshots
6. Fill in item details:
   - Name: AI Content Generator - GPT Powered SaaS Script
   - Description: Copy from `codecanyon/item-description.html`
   - Tags: Copy from `codecanyon/tags.txt`
   - Features: Copy from `codecanyon/features-list.txt`
7. Set pricing (see `codecanyon/pricing-strategy.md`)
8. Add demo URL
9. Submit for review

## Demo Site Setup

Before submitting, set up a live demo:

### Option A: Railway (Recommended - Free)
1. Push code to GitHub
2. Go to railway.app
3. New Project > Deploy from GitHub
4. Add environment variables
5. Deploy

### Option B: Render (Free)
1. Push code to GitHub  
2. Go to render.com
3. New Web Service
4. Connect repo
5. Add environment variables
6. Deploy

### Demo Credentials
Create these accounts on your demo:
- Admin: demo@admin.com / demo123
- User: demo@user.com / demo123

Add to your CodeCanyon description:
```
DEMO CREDENTIALS:
Admin: demo@admin.com / demo123
User: demo@user.com / demo123
```

## Final Checklist

- [ ] Code is clean (no console.logs)
- [ ] No real API keys in files
- [ ] .env.example included (not .env)
- [ ] Documentation complete
- [ ] All features working
- [ ] Demo site live
- [ ] Screenshots ready
- [ ] Thumbnail created
- [ ] Description written
- [ ] Tags selected
- [ ] Price decided

Good luck with your submission! 🚀
