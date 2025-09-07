// backend/routes/comments.js
const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware');
const router = express.Router();

// Get all comments for a task
router.get('/task/:taskId', authenticateToken, (req, res) => {
    const taskId = req.params.taskId;
    const sql = `
        SELECT c.id, c.content, c.created_at, u.name as userName 
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.task_id =? 
        ORDER BY c.created_at ASC
    `;
    db.all(sql, [taskId], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.json(rows);
    });
});

// Add a new comment to a task
router.post('/task/:taskId', authenticateToken, (req, res) => {
    const taskId = req.params.taskId;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
        return res.status(400).json({ message: 'Comment content is required' });
    }

    const sql = 'INSERT INTO comments (task_id, user_id, content) VALUES (?,?,?)';
    db.run(sql, [taskId, userId, content], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.status(201).json({ id: this.lastID, content, user_id: userId });
    });
});

module.exports = router;
