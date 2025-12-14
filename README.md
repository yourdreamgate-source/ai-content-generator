# AI Content Generator SaaS

A powerful AI-powered content generation platform that helps users create blog posts, social media content, emails, product descriptions, and more using OpenAI's GPT technology.

![AI Content Generator](https://via.placeholder.com/800x400?text=AI+Content+Generator)

## ✨ Features

### For Users
- **Multiple Content Types**: Generate blog posts, social media content, emails, product descriptions, ad copy, SEO meta descriptions, YouTube scripts, and newsletters
- **Template Library**: Pre-built templates with customizable parameters for quick content generation
- **Custom Prompts**: Write your own prompts for any type of content
- **Generation History**: Access all your past generations with search and filter
- **Favorites**: Save your best generations for quick access
- **Copy & Download**: Easily copy or download generated content
- **Credit System**: Fair usage with credit-based generation

### For Admins
- **Dashboard Analytics**: View total users, generations, and usage statistics
- **User Management**: Add credits, change roles, and manage user accounts
- **Template Management**: Create, edit, and manage content templates
- **Usage Tracking**: Monitor platform usage and top users

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone or extract the project**
   ```bash
   cd ai-content-generator
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment**
   ```bash
   copy .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-api-key-here
   JWT_SECRET=your-random-secret-key
   ```

4. **Start the application**
   ```bash
   # Development mode (runs both server and client)
   npm run dev
   
   # Or run separately:
   npm start          # Backend only (port 5000)
   npm run client     # Frontend only (port 3000)
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### First User = Admin
The first user to register automatically becomes an admin with full access to the admin panel.

## 📁 Project Structure

```
ai-content-generator/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context (Auth)
│   │   ├── pages/          # Page components
│   │   │   └── admin/      # Admin pages
│   │   └── utils/          # API utilities
│   └── package.json
├── server/                 # Node.js backend
│   ├── database/           # SQLite database setup
│   ├── middleware/         # Auth middleware
│   ├── routes/             # API routes
│   └── index.js            # Server entry point
├── .env.example            # Environment template
├── package.json            # Root package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `JWT_SECRET` | JWT signing secret | (required) |
| `OPENAI_API_KEY` | OpenAI API key | (required) |
| `DATABASE_PATH` | SQLite database path | ./database.sqlite |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:3000 |

### Default Templates

The application comes with 8 pre-configured templates:
1. Blog Post
2. Social Media Post
3. Email Copy
4. Product Description
5. Ad Copy
6. SEO Meta Description
7. YouTube Script
8. Newsletter

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Content
- `POST /api/content/generate` - Generate content
- `GET /api/content/history` - Get generation history
- `GET /api/content/:id` - Get single generation
- `PATCH /api/content/:id/favorite` - Toggle favorite
- `DELETE /api/content/:id` - Delete generation

### Templates
- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get single template

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - List users
- `PATCH /api/admin/users/:id/credits` - Update credits
- `PATCH /api/admin/users/:id/role` - Update role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/templates` - List all templates
- `POST /api/admin/templates` - Create template
- `PUT /api/admin/templates/:id` - Update template
- `DELETE /api/admin/templates/:id` - Delete template

## 🚀 Deployment

### Production Build

```bash
# Build frontend
npm run build

# Start production server
NODE_ENV=production npm start
```

### Deploy to VPS/Server

1. Upload files to server
2. Install Node.js 18+
3. Run `npm run install-all`
4. Configure `.env` with production values
5. Run `npm run build`
6. Use PM2 or similar for process management:
   ```bash
   pm2 start server/index.js --name ai-content-generator
   ```

### Deploy to Platforms

**Heroku:**
```bash
heroku create
heroku config:set OPENAI_API_KEY=sk-xxx JWT_SECRET=xxx
git push heroku main
```

**Railway/Render:**
- Connect GitHub repo
- Set environment variables
- Deploy automatically

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🆘 Support

For support, please open an issue on the repository or contact the author.

---

**Built with ❤️ using React, Node.js, and OpenAI**
