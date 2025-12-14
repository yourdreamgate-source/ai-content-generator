const express = require('express');
const { db } = require('../database/init');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, isAdmin);

// Dashboard stats
router.get('/stats', (req, res) => {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const totalGenerations = db.prepare('SELECT COUNT(*) as count FROM generations').get().count;
    const totalTemplates = db.prepare('SELECT COUNT(*) as count FROM templates WHERE is_active = 1').get().count;
    
    // Generations by content type
    const generationsByType = db.prepare(`
      SELECT content_type, COUNT(*) as count 
      FROM generations 
      GROUP BY content_type 
      ORDER BY count DESC
    `).all();

    // Recent generations
    const recentGenerations = db.prepare(`
      SELECT g.id, g.content_type, g.created_at, u.name as user_name, u.email
      FROM generations g
      JOIN users u ON g.user_id = u.id
      ORDER BY g.created_at DESC
      LIMIT 10
    `).all();

    // Users with most generations
    const topUsers = db.prepare(`
      SELECT u.id, u.name, u.email, COUNT(g.id) as generation_count
      FROM users u
      LEFT JOIN generations g ON u.id = g.user_id
      GROUP BY u.id
      ORDER BY generation_count DESC
      LIMIT 5
    `).all();

    res.json({
      totalUsers,
      totalGenerations,
      totalTemplates,
      generationsByType,
      recentGenerations,
      topUsers
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get all users
router.get('/users', (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, email, name, credits, role, created_at FROM users';
    const params = [];

    if (search) {
      query += ' WHERE email LIKE ? OR name LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const users = db.prepare(query).all(...params);

    let countQuery = 'SELECT COUNT(*) as total FROM users';
    const countParams = [];
    
    if (search) {
      countQuery += ' WHERE email LIKE ? OR name LIKE ?';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const { total } = db.prepare(countQuery).get(...countParams);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user credits
router.patch('/users/:id/credits', (req, res) => {
  try {
    const { credits } = req.body;
    const userId = req.params.id;

    if (typeof credits !== 'number' || credits < 0) {
      return res.status(400).json({ error: 'Invalid credits value' });
    }

    const result = db.prepare('UPDATE users SET credits = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(credits, userId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = db.prepare('SELECT id, email, name, credits, role FROM users WHERE id = ?').get(userId);
    res.json({ message: 'Credits updated', user });
  } catch (error) {
    console.error('Update credits error:', error);
    res.status(500).json({ error: 'Failed to update credits' });
  }
});

// Update user role
router.patch('/users/:id/role', (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Prevent removing last admin
    if (role === 'user') {
      const adminCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('admin').count;
      const currentUser = db.prepare('SELECT role FROM users WHERE id = ?').get(userId);
      
      if (adminCount === 1 && currentUser?.role === 'admin') {
        return res.status(400).json({ error: 'Cannot remove the last admin' });
      }
    }

    const result = db.prepare('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(role, userId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = db.prepare('SELECT id, email, name, credits, role FROM users WHERE id = ?').get(userId);
    res.json({ message: 'Role updated', user });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// Delete user
router.delete('/users/:id', (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent self-deletion
    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Delete user's generations first
    db.prepare('DELETE FROM generations WHERE user_id = ?').run(userId);
    
    const result = db.prepare('DELETE FROM users WHERE id = ?').run(userId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Template management
router.get('/templates', (req, res) => {
  try {
    const templates = db.prepare('SELECT * FROM templates ORDER BY created_at DESC').all();
    res.json(templates);
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

router.post('/templates', (req, res) => {
  try {
    const { name, description, content_type, prompt_template, icon } = req.body;

    if (!name || !content_type || !prompt_template) {
      return res.status(400).json({ error: 'Name, content type, and prompt template are required' });
    }

    const result = db.prepare(`
      INSERT INTO templates (name, description, content_type, prompt_template, icon)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, description || '', content_type, prompt_template, icon || 'file-text');

    const template = db.prepare('SELECT * FROM templates WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(template);
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
});

router.put('/templates/:id', (req, res) => {
  try {
    const { name, description, content_type, prompt_template, icon, is_active } = req.body;
    const templateId = req.params.id;

    const result = db.prepare(`
      UPDATE templates 
      SET name = ?, description = ?, content_type = ?, prompt_template = ?, icon = ?, is_active = ?
      WHERE id = ?
    `).run(name, description, content_type, prompt_template, icon, is_active ? 1 : 0, templateId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const template = db.prepare('SELECT * FROM templates WHERE id = ?').get(templateId);
    res.json(template);
  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
});

router.delete('/templates/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM templates WHERE id = ?').run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json({ message: 'Template deleted' });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

module.exports = router;
