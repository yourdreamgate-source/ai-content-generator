# Demo Site Setup Guide - AI Content Generator

## Option 1: Railway (Recommended - Free)

### Steps:
1. Push code to GitHub
2. Go to railway.app
3. Click "New Project" → "Deploy from GitHub"
4. Select your repo
5. Add environment variables:
   ```
   JWT_SECRET=your-random-secret-here
   OPENAI_API_KEY=sk-your-openai-key
   NODE_ENV=production
   ```
6. Deploy!

---

## Option 2: Render (Free)

1. Go to render.com
2. New → Web Service
3. Connect GitHub
4. Settings:
   - Build: `npm run install-all && npm run build`
   - Start: `npm start`
5. Add environment variables
6. Deploy

---

## After Deployment

### Create Demo Accounts:

1. Register admin: demo@admin.com / demo123
2. Register user: demo@user.com / demo123

### Add Sample Generations:

Login as user and generate:
1. A blog post about "remote work benefits"
2. Social media post about "product launch"
3. Email copy for "welcome email"
4. Product description for "wireless headphones"

This shows the app working with real content.

### Set Credits:
Login as admin → Manage Users → Set demo user credits to 50

---

## Demo Credentials for CodeCanyon

Add to your item description:
```
DEMO CREDENTIALS:
================
Admin: demo@admin.com / demo123
User: demo@user.com / demo123

Demo URL: https://your-demo-url.com
```

## Important: OpenAI Costs

Demo site will use your OpenAI API credits.
- GPT-3.5: ~$0.002 per generation
- Set up billing alerts at platform.openai.com
- Consider limiting demo user credits
