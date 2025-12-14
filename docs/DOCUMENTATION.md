# AI Content Generator - Complete Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Installation Guide](#installation-guide)
3. [Configuration](#configuration)
4. [User Guide](#user-guide)
5. [Admin Guide](#admin-guide)
6. [API Reference](#api-reference)
7. [Customization](#customization)
8. [Troubleshooting](#troubleshooting)
9. [FAQ](#faq)

---

## Introduction

AI Content Generator is a modern SaaS application that leverages OpenAI's GPT technology to help users create high-quality content. Whether you need blog posts, social media content, emails, or product descriptions, this tool makes content creation fast and easy.

### Key Features
- 8 pre-built content templates
- Custom prompt support
- User authentication & authorization
- Credit-based usage system
- Admin dashboard with analytics
- Generation history with favorites
- Responsive design for all devices
- Clean, modern UI

### Tech Stack
- **Frontend**: React 18, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: SQLite (easy setup, no external DB needed)
- **AI**: OpenAI GPT-3.5/4 API
- **Authentication**: JWT tokens

---

## Installation Guide

### System Requirements
- Node.js 18.0 or higher
- npm 9.0 or higher (comes with Node.js)
- 512MB RAM minimum
- 100MB disk space

### Step-by-Step Installation

#### 1. Extract Files
Extract the downloaded zip file to your desired location.

#### 2. Install Dependencies
Open terminal/command prompt in the project folder:

```bash
cd ai-content-generator
npm run install-all
```

This installs both server and client dependencies.

#### 3. Configure Environment
Copy the example environment file:

**Windows:**
```bash
copy .env.example .env
```

**Mac/Linux:**
```bash
cp .env.example .env
```

#### 4. Add Your OpenAI API Key
Edit the `.env` file and add your credentials:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-random-string-here
OPENAI_API_KEY=sk-your-openai-api-key-here
DATABASE_PATH=./database.sqlite
CLIENT_URL=http://localhost:3000
```

**Important:** 
- Get your OpenAI API key from: https://platform.openai.com/api-keys
- Generate a random JWT_SECRET (use a password generator)

#### 5. Start the Application

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm run build
npm start
```

#### 6. Access the Application
- Open browser: http://localhost:3000
- Register your first account (becomes admin automatically)

---

## Configuration

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| PORT | No | Server port | 5000 |
| NODE_ENV | No | Environment mode | production |
| JWT_SECRET | Yes | Secret for JWT tokens | random-32-char-string |
| OPENAI_API_KEY | Yes | Your OpenAI API key | sk-xxx... |
| DATABASE_PATH | No | SQLite database location | ./database.sqlite |
| CLIENT_URL | No | Frontend URL for CORS | http://localhost:3000 |

### OpenAI Configuration

The application uses GPT-3.5-turbo by default. To change the model, edit `server/routes/content.js`:

```javascript
const completion = await openai.chat.completions.create({
  model: 'gpt-4', // Change to gpt-4 for better quality
  // ...
});
```

### Credit System

New users receive 100 credits by default. Each generation costs 1 credit. To change default credits, edit `server/routes/auth.js`:

```javascript
// In the register route
const result = db.prepare(
  'INSERT INTO users (email, password, name, role, credits) VALUES (?, ?, ?, ?, ?)'
).run(email, hashedPassword, name, role, 200); // Change 100 to desired amount
```

---

## User Guide

### Registration & Login
1. Click "Sign up" on the login page
2. Enter your name, email, and password
3. You'll be logged in automatically

### Generating Content

#### Using Templates
1. Go to "Templates" page
2. Click on a template (e.g., "Blog Post")
3. Fill in the required fields
4. Click "Generate Content"
5. Copy or download the result

#### Custom Generation
1. Go to "Generate" page
2. Write your own prompt describing what you want
3. Click "Generate Content"
4. Copy or download the result

### Managing History
1. Go to "History" page
2. View all your past generations
3. Click on any item to see full content
4. Star favorites for quick access
5. Delete unwanted generations

### Profile Settings
1. Go to "Profile" page
2. Update your name
3. Change your password
4. View your credit balance

---

## Admin Guide

### Accessing Admin Panel
Only users with "admin" role can access admin features. The first registered user automatically becomes admin.

### Dashboard
View platform statistics:
- Total users
- Total generations
- Active templates
- Generations by content type
- Top users

### Managing Users
1. Go to "Admin > Manage Users"
2. Search users by name or email
3. Click on credits to edit user credits
4. Click role badge to toggle admin/user
5. Delete users if needed

### Managing Templates
1. Go to "Admin > Manage Templates"
2. Click "Add Template" to create new
3. Edit existing templates
4. Toggle active/inactive status
5. Delete unused templates

#### Creating Templates
Templates use placeholders with double curly braces:

```
Write a {{content_type}} about {{topic}}. 
Tone: {{tone}}
Length: {{length}} words
```

Users will see input fields for each placeholder.

---

## API Reference

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Body: { name, email, password }
Response: { token, user }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: { user }
```

### Content Endpoints

#### Generate Content
```
POST /api/content/generate
Headers: Authorization: Bearer <token>
Body: { templateId?, prompt, contentType, parameters? }
Response: { id, content, creditsRemaining }
```

#### Get History
```
GET /api/content/history?page=1&limit=10&favorite=true
Headers: Authorization: Bearer <token>
Response: { generations, pagination }
```

### Admin Endpoints

All admin endpoints require admin role.

#### Get Stats
```
GET /api/admin/stats
Response: { totalUsers, totalGenerations, ... }
```

#### Update User Credits
```
PATCH /api/admin/users/:id/credits
Body: { credits: 100 }
Response: { user }
```

---

## Customization

### Changing Colors
Edit `client/src/index.css` to change the color scheme. The app uses Tailwind CSS classes.

Primary color (indigo) can be changed by replacing:
- `bg-indigo-600` → `bg-blue-600`
- `text-indigo-600` → `text-blue-600`
- etc.

### Adding New Templates
1. Login as admin
2. Go to Admin > Manage Templates
3. Click "Add Template"
4. Fill in the form with placeholders

### Changing Logo
Replace the Sparkles icon in:
- `client/src/components/Layout.js`
- `client/src/pages/Login.js`
- `client/src/pages/Register.js`

### Adding Payment Integration
To add Stripe or PayPal:
1. Create payment routes in `server/routes/`
2. Add payment page in `client/src/pages/`
3. Update credit system to add credits on successful payment

---

## Troubleshooting

### Common Issues

#### "Invalid API Key" Error
- Check your OPENAI_API_KEY in .env file
- Ensure no extra spaces or quotes
- Verify key is active at platform.openai.com

#### "Cannot connect to server"
- Ensure server is running (npm start)
- Check PORT in .env matches your setup
- Verify no firewall blocking the port

#### "Database error"
- Delete database.sqlite file
- Restart server (will recreate database)

#### Blank page after login
- Clear browser cache
- Check browser console for errors
- Ensure client build is complete

### Getting Help
1. Check this documentation
2. Review error messages in terminal
3. Check browser developer console
4. Contact support with error details

---

## FAQ

**Q: How do I get an OpenAI API key?**
A: Visit https://platform.openai.com/api-keys, create an account, and generate a new API key.

**Q: How much does OpenAI API cost?**
A: GPT-3.5-turbo costs approximately $0.002 per 1K tokens. Average generation costs $0.01-0.05.

**Q: Can I use GPT-4?**
A: Yes, change the model in server/routes/content.js to 'gpt-4'.

**Q: How do I add more credits to users?**
A: Admin can edit credits in Admin > Manage Users.

**Q: Can I remove the credit system?**
A: Yes, remove credit checks in server/routes/content.js.

**Q: Is the database secure?**
A: SQLite is file-based. For production, consider PostgreSQL or MySQL.

**Q: Can I deploy to shared hosting?**
A: Node.js requires VPS or cloud hosting (Heroku, Railway, DigitalOcean, etc.)

---

## Support

For additional support or custom development, please contact the author.

**Version:** 1.0.0
**Last Updated:** December 2024
