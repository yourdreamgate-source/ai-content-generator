const express = require('express');
const { db } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all active templates
router.get('/', authenticateToken, (req, res) => {
  try {
    const templates = db.prepare('SELECT * FROM templates WHERE is_active = 1 ORDER BY name').all();
    res.json(templates);
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Get single template
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const template = db.prepare('SELECT * FROM templates WHERE id = ? AND is_active = 1').get(req.params.id);
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json(template);
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// Get templates by content type
router.get('/type/:contentType', authenticateToken, (req, res) => {
  try {
    const templates = db.prepare('SELECT * FROM templates WHERE content_type = ? AND is_active = 1')
      .all(req.params.contentType);
    res.json(templates);
  } catch (error) {
    console.error('Get templates by type error:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

module.exports = router;
