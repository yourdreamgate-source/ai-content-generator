# Pre-Written Support Responses

Copy-paste these responses for common customer questions. Saves time and ensures consistent support.

---

## Installation Issues

### Node.js Not Installed
```
Hi,

Thanks for your purchase!

The error indicates Node.js is not installed on your system. Please follow these steps:

1. Download Node.js 18+ from https://nodejs.org
2. Install it (use the LTS version)
3. Restart your terminal/command prompt
4. Run `node -v` to verify installation
5. Then run `npm run install-all`

Let me know if you need further assistance!

Best regards
```

### npm install Failed
```
Hi,

Thanks for reaching out!

This error usually occurs due to network issues or permission problems. Please try:

1. Delete the `node_modules` folder if it exists
2. Delete `package-lock.json` file
3. Run `npm cache clean --force`
4. Run `npm run install-all` again

If you're on Mac/Linux, you might need to use `sudo`:
`sudo npm run install-all`

Let me know if this helps!

Best regards
```

### OpenAI API Key Error
```
Hi,

The "Invalid API Key" error means your OpenAI API key is not configured correctly.

Please check:
1. You have a valid API key from https://platform.openai.com/api-keys
2. The key is added to your .env file (not .env.example)
3. There are no extra spaces or quotes around the key
4. Your OpenAI account has credits/payment method added

Your .env should look like:
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx

Let me know if you need more help!

Best regards
```

---

## Feature Questions

### How to Add Payment/Stripe
```
Hi,

Thanks for your interest!

The current version doesn't include payment integration, but you can add it:

1. Create a Stripe account at stripe.com
2. Install Stripe: `npm install stripe`
3. Create payment routes in server/routes/
4. Add payment page in client/src/pages/
5. Update credits on successful payment

I'm considering adding this in a future update. Would you like me to prioritize it?

Best regards
```

### How to Change Colors/Theme
```
Hi,

Great question! The app uses Tailwind CSS, so changing colors is easy:

1. Open any component file in client/src/
2. Find color classes like `bg-indigo-600` or `text-indigo-500`
3. Replace with your preferred color: `bg-blue-600`, `bg-green-600`, etc.

Tailwind color options: https://tailwindcss.com/docs/customizing-colors

For a global change, you can do find-and-replace:
- Find: `indigo`
- Replace: `blue` (or your color)

Let me know if you need specific customization help!

Best regards
```

### How to Use GPT-4
```
Hi,

To use GPT-4 instead of GPT-3.5:

1. Open `server/routes/content.js`
2. Find this line: `model: 'gpt-3.5-turbo'`
3. Change to: `model: 'gpt-4'`
4. Save and restart the server

Note: GPT-4 is more expensive ($0.03/1K tokens vs $0.002/1K). Make sure your OpenAI account has GPT-4 access enabled.

Best regards
```

---

## Deployment Questions

### How to Deploy to Heroku
```
Hi,

Here's how to deploy to Heroku:

1. Create Heroku account at heroku.com
2. Install Heroku CLI
3. In your project folder, run:
   ```
   heroku create your-app-name
   heroku config:set OPENAI_API_KEY=sk-xxx
   heroku config:set JWT_SECRET=your-secret
   heroku config:set NODE_ENV=production
   git push heroku main
   ```
4. Open: `heroku open`

Let me know if you encounter any issues!

Best regards
```

### How to Deploy to VPS
```
Hi,

For VPS deployment (DigitalOcean, Linode, etc.):

1. SSH into your server
2. Install Node.js 18+: 
   `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -`
   `sudo apt-get install -y nodejs`
3. Upload files via SFTP or git clone
4. Run `npm run install-all`
5. Configure .env with production values
6. Run `npm run build`
7. Install PM2: `npm install -g pm2`
8. Start: `pm2 start server/index.js --name ai-content`
9. Setup Nginx as reverse proxy (optional)

Need help with Nginx config? Let me know!

Best regards
```

---

## Refund Requests

### Polite Decline (Valid Product)
```
Hi,

I'm sorry to hear the product didn't meet your expectations.

Before processing a refund, I'd like to help resolve any issues you're facing. Could you please share:
1. What specific problem are you experiencing?
2. What were you expecting that wasn't delivered?

I'm confident we can work together to get this working for you. The product includes all features listed in the description and I'm here to support you.

Looking forward to your response!

Best regards
```

### Technical Issue Refund
```
Hi,

I understand you're having technical difficulties. I apologize for the inconvenience.

I'd really like to help you get this working before considering a refund. Could you please:
1. Share the exact error message
2. Tell me your Node.js version (`node -v`)
3. Share your operating system

Most issues can be resolved quickly. If we can't fix it within 48 hours, I'll process your refund immediately.

Best regards
```

---

## Positive Review Response
```
Hi [Name],

Thank you so much for the wonderful review! 🙏

I'm thrilled that you're enjoying the AI Content Generator. Your feedback means a lot and motivates me to keep improving the product.

If you ever have feature requests or suggestions, please don't hesitate to reach out. I'm always looking for ways to make the product better.

Wishing you great success with your content creation!

Best regards
```

---

## Update Announcement Template
```
📢 Version X.X Update Released!

Hi everyone,

I'm excited to announce a new update for AI Content Generator!

**What's New:**
• Feature 1
• Feature 2
• Bug fix 1
• Bug fix 2

**How to Update:**
1. Download the new files from your downloads page
2. Backup your .env file and database.sqlite
3. Replace all files except .env and database.sqlite
4. Run `npm run install-all`
5. Restart the server

As always, feel free to reach out if you have any questions!

Best regards
```
