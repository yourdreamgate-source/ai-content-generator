-- Demo Data for CodeCanyon Demo Site
-- Run this after setting up the application to populate demo data

-- Note: Passwords are hashed. These are just for reference.
-- Actual password for all demo users: demo123
-- You'll need to register these users through the app or use bcrypt to hash passwords

-- Sample generations to show in history
-- Run these INSERT statements after creating demo users

-- First, register users through the app:
-- 1. demo@admin.com / demo123 (first user = admin)
-- 2. demo@user.com / demo123
-- 3. john@example.com / demo123
-- 4. sarah@example.com / demo123
-- 5. mike@example.com / demo123

-- Then run these to add sample generations (adjust user_id as needed):

INSERT INTO generations (user_id, template_id, content_type, prompt, generated_content, is_favorite, created_at) VALUES
(1, 1, 'blog', 'Benefits of remote work', '# The Benefits of Remote Work for Modern Professionals

Remote work has transformed the way we think about employment. Here are the key benefits:

## 1. Flexibility
Work from anywhere, anytime. Set your own schedule and achieve better work-life balance.

## 2. Increased Productivity
Studies show remote workers are often more productive without office distractions.

## 3. Cost Savings
Save money on commuting, work clothes, and daily lunches.

## 4. Better Health
More time for exercise, home-cooked meals, and reduced stress from commuting.

## Conclusion
Remote work is not just a trend—it''s the future of work.', 1, datetime('now', '-1 day')),

(1, 2, 'social', 'Product launch announcement', '🚀 BIG NEWS! 🚀

We''re thrilled to announce the launch of our revolutionary new product!

After months of hard work, late nights, and countless cups of coffee, it''s finally here.

✨ What makes it special:
• Saves you 10+ hours per week
• Easy to use - no learning curve
• Affordable pricing for everyone

Ready to transform your workflow?

Link in bio! 👆

#ProductLaunch #Innovation #Startup #NewProduct #Excited', 0, datetime('now', '-2 days')),

(1, 3, 'email', 'Welcome email for new subscribers', 'Subject: Welcome to the Family! 🎉

Hi [Name],

Welcome aboard! We''re so excited to have you join our community.

Here''s what you can expect:
• Weekly tips and insights
• Exclusive offers just for subscribers
• Early access to new features

To get started, check out our most popular resources:
1. Getting Started Guide
2. Video Tutorials
3. Community Forum

Have questions? Just reply to this email - we''re here to help!

Cheers,
The Team

P.S. Don''t forget to follow us on social media for daily inspiration!', 1, datetime('now', '-3 days')),

(2, 4, 'product', 'Wireless headphones description', 'Experience Pure Audio Bliss

Introducing the UltraSound Pro Wireless Headphones - where cutting-edge technology meets unparalleled comfort.

**Key Features:**
🎵 40-hour battery life
🎵 Active Noise Cancellation
🎵 Premium memory foam cushions
🎵 Bluetooth 5.0 connectivity
🎵 Built-in microphone for calls

**Why Choose UltraSound Pro?**
Whether you''re working from home, hitting the gym, or relaxing on a flight, these headphones deliver crystal-clear sound that adapts to your environment.

**What''s in the Box:**
- UltraSound Pro Headphones
- USB-C charging cable
- Carrying case
- Audio cable for wired use
- Quick start guide

**30-Day Money-Back Guarantee**

Order now and hear the difference!', 0, datetime('now', '-4 days')),

(2, 5, 'ad', 'Facebook ad for fitness app', '💪 Tired of complicated workout apps?

Meet FitSimple - the workout app that actually works.

✅ 5-minute daily workouts
✅ No equipment needed
✅ Personalized to YOUR goals
✅ Track progress easily

Join 100,000+ users who''ve transformed their fitness journey.

🎁 FREE for 7 days - No credit card required!

Download now 👇', 1, datetime('now', '-5 days'));

-- Update user credits to show variety
UPDATE users SET credits = 87 WHERE email = 'demo@admin.com';
UPDATE users SET credits = 45 WHERE email = 'demo@user.com';
