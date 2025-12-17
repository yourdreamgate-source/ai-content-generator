/**
 * Demo Setup Script
 * Creates demo accounts and sample content for CodeCanyon demo
 * Run: node setup-demo.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { initDatabase, getDb } = require('./server/database/init');

async function setupDemo() {
  console.log('🚀 Setting up demo data...\n');
  
  await initDatabase();
  const db = getDb();

  // Demo accounts
  const accounts = [
    { email: 'demo@admin.com', password: 'demo123', name: 'Demo Admin', role: 'admin', credits: 9999 },
    { email: 'demo@user.com', password: 'demo123', name: 'Demo User', role: 'user', credits: 500 }
  ];

  console.log('📧 Creating demo accounts...');
  for (const acc of accounts) {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(acc.email);
    if (existing) {
      console.log(`   ⚠️  ${acc.email} already exists, updating...`);
      const hashedPassword = await bcrypt.hash(acc.password, 10);
      db.prepare('UPDATE users SET password = ?, name = ?, role = ?, credits = ? WHERE email = ?')
        .run(hashedPassword, acc.name, acc.role, acc.credits, acc.email);
    } else {
      const hashedPassword = await bcrypt.hash(acc.password, 10);
      db.prepare('INSERT INTO users (email, password, name, role, credits) VALUES (?, ?, ?, ?, ?)')
        .run(acc.email, hashedPassword, acc.name, acc.role, acc.credits);
      console.log(`   ✅ Created: ${acc.email}`);
    }
  }

  // Get demo user ID
  const demoUser = db.prepare('SELECT id FROM users WHERE email = ?').get('demo@user.com');
  
  // Sample generated content
  const sampleContent = [
    {
      content_type: 'blog',
      prompt: 'Write a blog post about AI in content marketing',
      generated_content: `# The Future of AI in Content Marketing

Artificial Intelligence is revolutionizing how businesses create and distribute content. Here's what you need to know about this game-changing technology.

## Why AI Matters for Content Marketing

In today's fast-paced digital landscape, content is king. But creating high-quality content consistently is challenging. AI tools are stepping in to help marketers:

- **Generate ideas faster** - AI can analyze trends and suggest topics
- **Write drafts quickly** - First drafts in seconds, not hours
- **Optimize for SEO** - Built-in keyword optimization
- **Personalize at scale** - Tailor content for different audiences

## Getting Started with AI Content Tools

The key is to use AI as an assistant, not a replacement. Human creativity combined with AI efficiency creates the best results.

Start small, experiment often, and always review AI-generated content before publishing.

*Ready to transform your content strategy? The future is here.*`
    },
    {
      content_type: 'social',
      prompt: 'Create a LinkedIn post about productivity tips',
      generated_content: `🚀 5 Productivity Hacks That Changed My Work Life

After years of trial and error, here's what actually works:

1️⃣ Time blocking - Schedule everything, including breaks
2️⃣ Two-minute rule - If it takes less than 2 min, do it now
3️⃣ Single-tasking - Multitasking is a myth
4️⃣ Morning routine - Win the morning, win the day
5️⃣ Weekly review - Reflect and plan every Sunday

The secret? Consistency beats intensity every time.

What's your #1 productivity tip? 👇

#Productivity #WorkLife #CareerGrowth #ProfessionalDevelopment`
    },
    {
      content_type: 'email',
      prompt: 'Write a welcome email for new SaaS subscribers',
      generated_content: `Subject: Welcome to the family! Here's how to get started 🎉

Hi {{name}},

Welcome aboard! We're thrilled to have you join us.

You've just unlocked access to powerful tools that will transform how you work. Here's how to make the most of your first week:

**Day 1:** Complete your profile setup
**Day 2:** Watch our 5-minute quick start video
**Day 3:** Create your first project
**Day 4:** Invite your team members
**Day 5:** Explore advanced features

Need help? Our support team is just one click away.

Let's build something amazing together!

Cheers,
The Team

P.S. Reply to this email with any questions - we read every message!`
    },
    {
      content_type: 'product',
      prompt: 'Write a product description for wireless earbuds',
      generated_content: `**SoundPro X1 Wireless Earbuds - Your Music, Unleashed**

Experience audio like never before with the SoundPro X1. Engineered for audiophiles and everyday listeners alike.

✨ **Key Features:**
• 40-hour total battery life with charging case
• Active Noise Cancellation (ANC)
• Crystal-clear call quality with 4 microphones
• IPX5 water resistance
• Touch controls for seamless operation

🎵 **Premium Sound Quality**
Custom 10mm drivers deliver deep bass, clear mids, and crisp highs. Whether you're commuting, working out, or relaxing - every note sounds perfect.

📱 **Seamless Connectivity**
Bluetooth 5.3 ensures stable connection up to 30 feet. Switch between devices instantly.

**What's in the box:** Earbuds, charging case, 3 ear tip sizes, USB-C cable, user guide

⭐ 30-day money-back guarantee | 1-year warranty

**$79.99** ~~$129.99~~ - Limited time offer!

[Add to Cart]`
    },
    {
      content_type: 'ad',
      prompt: 'Create Facebook ad copy for an online course',
      generated_content: `🎓 Stop Watching. Start Doing.

Tired of tutorials that don't get results?

Our hands-on course teaches you real skills in just 30 days:
✅ Project-based learning
✅ Expert mentorship
✅ Certificate included
✅ Lifetime access

Join 10,000+ students who transformed their careers.

🔥 FLASH SALE: 60% OFF (ends Sunday)

👉 Click "Learn More" to claim your spot

"This course changed everything for me" - Sarah M. ⭐⭐⭐⭐⭐`
    }
  ];

  console.log('\n📝 Creating sample content...');
  for (const content of sampleContent) {
    db.prepare('INSERT INTO generations (user_id, content_type, prompt, generated_content) VALUES (?, ?, ?, ?)')
      .run(demoUser.id, content.content_type, content.prompt, content.generated_content);
    console.log(`   ✅ Added: ${content.content_type} content`);
  }

  console.log('\n========================================');
  console.log('✅ Demo setup complete!');
  console.log('========================================\n');
  console.log('Demo Accounts:');
  console.log('  Admin: demo@admin.com / demo123');
  console.log('  User:  demo@user.com / demo123');
  console.log('\nSample content has been added to demo user account.');
  console.log('');
}

setupDemo().catch(console.error);
