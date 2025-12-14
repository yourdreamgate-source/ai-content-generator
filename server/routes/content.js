const express = require('express');
const OpenAI = require('openai');
const { db } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate content
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { templateId, prompt, contentType, parameters } = req.body;
    const userId = req.user.id;

    // Check credits
    if (req.user.credits <= 0) {
      return res.status(403).json({ error: 'Insufficient credits. Please contact admin for more credits.' });
    }

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Build the full prompt
    let fullPrompt = prompt;
    
    if (templateId) {
      const template = db.prepare('SELECT * FROM templates WHERE id = ?').get(templateId);
      if (template) {
        fullPrompt = template.prompt_template;
        // Replace placeholders with parameters
        if (parameters) {
          Object.keys(parameters).forEach(key => {
            fullPrompt = fullPrompt.replace(new RegExp(`{{${key}}}`, 'g'), parameters[key]);
          });
        }
      }
    }

    // Generate content using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional content writer. Create high-quality, engaging content based on the user\'s request. Be creative, informative, and maintain a professional tone unless otherwise specified.'
        },
        {
          role: 'user',
          content: fullPrompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    });

    const generatedContent = completion.choices[0].message.content;

    // Save generation to database
    const result = db.prepare(`
      INSERT INTO generations (user_id, template_id, content_type, prompt, generated_content)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, templateId || null, contentType || 'custom', prompt, generatedContent);

    // Deduct credit
    db.prepare('UPDATE users SET credits = credits - 1 WHERE id = ?').run(userId);

    // Get updated credits
    const updatedUser = db.prepare('SELECT credits FROM users WHERE id = ?').get(userId);

    res.json({
      id: result.lastInsertRowid,
      content: generatedContent,
      creditsRemaining: updatedUser.credits
    });
  } catch (error) {
    console.error('Generation error:', error);
    
    if (error.code === 'invalid_api_key') {
      return res.status(500).json({ error: 'Invalid OpenAI API key. Please check your configuration.' });
    }
    
    res.status(500).json({ error: 'Failed to generate content. Please try again.' });
  }
});

// Get generation history
router.get('/history', authenticateToken, (req, res) => {
  try {
    const { page = 1, limit = 10, contentType, favorite } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user.id;

    let query = 'SELECT g.*, t.name as template_name FROM generations g LEFT JOIN templates t ON g.template_id = t.id WHERE g.user_id = ?';
    const params = [userId];

    if (contentType) {
      query += ' AND g.content_type = ?';
      params.push(contentType);
    }

    if (favorite === 'true') {
      query += ' AND g.is_favorite = 1';
    }

    query += ' ORDER BY g.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const generations = db.prepare(query).all(...params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM generations WHERE user_id = ?';
    const countParams = [userId];
    
    if (contentType) {
      countQuery += ' AND content_type = ?';
      countParams.push(contentType);
    }
    
    if (favorite === 'true') {
      countQuery += ' AND is_favorite = 1';
    }

    const { total } = db.prepare(countQuery).get(...countParams);

    res.json({
      generations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Get single generation
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const generation = db.prepare(`
      SELECT g.*, t.name as template_name 
      FROM generations g 
      LEFT JOIN templates t ON g.template_id = t.id 
      WHERE g.id = ? AND g.user_id = ?
    `).get(req.params.id, req.user.id);

    if (!generation) {
      return res.status(404).json({ error: 'Generation not found' });
    }

    res.json(generation);
  } catch (error) {
    console.error('Get generation error:', error);
    res.status(500).json({ error: 'Failed to fetch generation' });
  }
});

// Toggle favorite
router.patch('/:id/favorite', authenticateToken, (req, res) => {
  try {
    const generation = db.prepare('SELECT * FROM generations WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);

    if (!generation) {
      return res.status(404).json({ error: 'Generation not found' });
    }

    const newFavoriteStatus = generation.is_favorite ? 0 : 1;
    db.prepare('UPDATE generations SET is_favorite = ? WHERE id = ?')
      .run(newFavoriteStatus, req.params.id);

    res.json({ is_favorite: newFavoriteStatus === 1 });
  } catch (error) {
    console.error('Favorite toggle error:', error);
    res.status(500).json({ error: 'Failed to update favorite status' });
  }
});

// Delete generation
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM generations WHERE id = ? AND user_id = ?')
      .run(req.params.id, req.user.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Generation not found' });
    }

    res.json({ message: 'Generation deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete generation' });
  }
});

module.exports = router;
