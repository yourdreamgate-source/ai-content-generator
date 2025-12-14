const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database.sqlite');

let db = null;

// Wrapper to make sql.js work like better-sqlite3
class DatabaseWrapper {
  constructor(sqliteDb) {
    this.sqliteDb = sqliteDb;
  }

  prepare(sql) {
    const self = this;
    return {
      run(...params) {
        try {
          self.sqliteDb.run(sql, params);
          const lastId = self.sqliteDb.exec('SELECT last_insert_rowid() as id')[0]?.values[0][0] || 0;
          const changes = self.sqliteDb.getRowsModified();
          saveDatabase();
          return { lastInsertRowid: lastId, changes };
        } catch (e) {
          console.error('SQL Error:', e.message, sql);
          throw e;
        }
      },
      get(...params) {
        try {
          const stmt = self.sqliteDb.prepare(sql);
          stmt.bind(params);
          if (stmt.step()) {
            const row = stmt.getAsObject();
            stmt.free();
            return row;
          }
          stmt.free();
          return undefined;
        } catch (e) {
          console.error('SQL Error:', e.message, sql);
          throw e;
        }
      },
      all(...params) {
        try {
          const results = [];
          const stmt = self.sqliteDb.prepare(sql);
          stmt.bind(params);
          while (stmt.step()) {
            results.push(stmt.getAsObject());
          }
          stmt.free();
          return results;
        } catch (e) {
          console.error('SQL Error:', e.message, sql);
          throw e;
        }
      }
    };
  }

  exec(sql) {
    try {
      this.sqliteDb.run(sql);
      saveDatabase();
    } catch (e) {
      console.error('SQL Exec Error:', e.message);
      throw e;
    }
  }
}

function saveDatabase() {
  if (db && db.sqliteDb) {
    const data = db.sqliteDb.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

async function initDatabase() {
  const SQL = await initSqlJs();
  
  let sqliteDb;
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    sqliteDb = new SQL.Database(fileBuffer);
  } else {
    sqliteDb = new SQL.Database();
  }
  
  db = new DatabaseWrapper(sqliteDb);

  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      credits INTEGER DEFAULT 100,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Content generations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS generations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      template_id INTEGER,
      content_type TEXT NOT NULL,
      prompt TEXT NOT NULL,
      generated_content TEXT NOT NULL,
      is_favorite INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Templates table
  db.exec(`
    CREATE TABLE IF NOT EXISTS templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      content_type TEXT NOT NULL,
      prompt_template TEXT NOT NULL,
      icon TEXT DEFAULT 'file-text',
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Insert default templates if none exist
  const templateCount = db.prepare('SELECT COUNT(*) as count FROM templates').get();
  if (templateCount.count === 0) {
    insertDefaultTemplates();
  }

  console.log('Database initialized successfully');
}

function insertDefaultTemplates() {
  const templates = [
    {
      name: 'Blog Post',
      description: 'Generate engaging blog posts on any topic',
      content_type: 'blog',
      prompt_template: 'Write a comprehensive blog post about: {{topic}}. Include an engaging introduction, main points with examples, and a conclusion. Tone: {{tone}}. Length: approximately {{length}} words.',
      icon: 'file-text'
    },
    {
      name: 'Social Media Post',
      description: 'Create viral social media content',
      content_type: 'social',
      prompt_template: 'Create a {{platform}} post about: {{topic}}. Make it engaging and include relevant hashtags. Tone: {{tone}}.',
      icon: 'share-2'
    },
    {
      name: 'Email Copy',
      description: 'Write professional email content',
      content_type: 'email',
      prompt_template: 'Write a {{email_type}} email about: {{topic}}. Purpose: {{purpose}}. Tone: {{tone}}. Include a compelling subject line.',
      icon: 'mail'
    },
    {
      name: 'Product Description',
      description: 'Create compelling product descriptions',
      content_type: 'product',
      prompt_template: 'Write a compelling product description for: {{product_name}}. Features: {{features}}. Target audience: {{audience}}. Highlight benefits and include a call to action.',
      icon: 'shopping-bag'
    },
    {
      name: 'Ad Copy',
      description: 'Generate high-converting ad copy',
      content_type: 'ad',
      prompt_template: 'Create {{ad_type}} ad copy for: {{product_or_service}}. Target audience: {{audience}}. Key benefit: {{benefit}}. Include a strong call to action.',
      icon: 'megaphone'
    },
    {
      name: 'SEO Meta Description',
      description: 'Write SEO-optimized meta descriptions',
      content_type: 'seo',
      prompt_template: 'Write an SEO-optimized meta description for a page about: {{topic}}. Target keyword: {{keyword}}. Keep it under 160 characters and make it compelling.',
      icon: 'search'
    },
    {
      name: 'YouTube Script',
      description: 'Create engaging video scripts',
      content_type: 'video',
      prompt_template: 'Write a YouTube video script about: {{topic}}. Video length: {{duration}} minutes. Include a hook, main content sections, and a call to action. Tone: {{tone}}.',
      icon: 'video'
    },
    {
      name: 'Newsletter',
      description: 'Craft engaging newsletter content',
      content_type: 'newsletter',
      prompt_template: 'Write a newsletter about: {{topic}}. Include a catchy headline, introduction, main content, and a call to action. Tone: {{tone}}.',
      icon: 'newspaper'
    }
  ];

  const insertStmt = db.prepare(`
    INSERT INTO templates (name, description, content_type, prompt_template, icon)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const template of templates) {
    insertStmt.run(template.name, template.description, template.content_type, template.prompt_template, template.icon);
  }

  console.log('Default templates inserted');
}

function getDb() {
  return db;
}

module.exports = { initDatabase, getDb, get db() { return db; } };
