# 🚀 Quick Start - CodeCanyon Submission

## Step 1: Setup Demo Data (2 min)
```bash
npm install
node setup-demo.js
```
This creates:
- Admin: demo@admin.com / demo123
- User: demo@user.com / demo123
- 5 sample generated contents

## Step 2: Take Screenshots (15 min)

Run the app locally:
```bash
npm run install-all
npm run dev
```
Open http://localhost:3000 in another terminal:
```bash
cd client && npm start
```

Take these screenshots (590x300 minimum):

| Screenshot | How to get it |
|------------|---------------|
| 1. thumbnail.png | App logo + tagline mockup |
| 2. preview.png | Dashboard overview |
| 3. login.png | Login page |
| 4. dashboard.png | User dashboard |
| 5. generate.png | Content generation page |
| 6. result.png | Generated content result |
| 7. templates.png | Templates list |
| 8. history.png | Generation history |
| 9. admin-dashboard.png | Admin panel |
| 10. admin-users.png | User management |

**Tip:** Use https://screely.com for browser mockups

## Step 3: Deploy to Railway (5 min)

1. Push to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. Go to https://railway.app
3. New Project → Deploy from GitHub
4. Select your repo
5. Add Variables:
   - `JWT_SECRET` = any-random-string-here
   - `OPENAI_API_KEY` = sk-your-key
   - `NODE_ENV` = production

6. Wait for deploy (~3 min)
7. Get your URL from Railway dashboard

## Step 4: Create ZIP Package (2 min)
```bash
create-package.bat
```
Output: `ai-content-generator.zip`

## Step 5: Upload to CodeCanyon

1. Go to https://codecanyon.net/upload
2. Category: Scripts & Code > JavaScript
3. Upload `ai-content-generator.zip`
4. Upload screenshots
5. Copy description from `codecanyon/item-description.html`
6. Copy tags from `codecanyon/tags.txt`
7. Set price: $29 Regular / $149 Extended
8. Add demo URL + credentials
9. Submit!

---

## Files Reference

| File | Purpose |
|------|---------|
| setup-demo.js | Creates demo accounts & content |
| create-package.bat | Creates ZIP for upload |
| codecanyon/item-description.html | Product description |
| codecanyon/tags.txt | Tags to copy |
| codecanyon/screenshots-guide.md | Screenshot details |

Good luck! 🎉
