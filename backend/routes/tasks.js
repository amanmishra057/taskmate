// backend/routes/tasks.js
const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware');
const router = express.Router();

// Create a new task in a project
router.post('/', authenticateToken, (req, res) => {
    const { project_id, title, description, status, priority, due_date } = req.body;
    if (!project_id ||!title) {
        return res.status(400).json({ message: 'Project ID and title are required' });
    }
    const sql = 'INSERT INTO tasks (project_id, title, description, status, priority, due_date) VALUES (?,?,?,?,?,?)';
    db.run(sql, [project_id, title, description, status || 'todo', priority || 'medium', due_date], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.status(201).json({ id: this.lastID,...req.body });
    });
});

// Update a task
router.put('/:id', authenticateToken, (req, res) => {
    const taskId = req.params.id;
    const { title, description, status, priority, assignee_id, due_date } = req.body;

    // Build the query dynamically based on provided fields
    let fields = [];
    let params = [];
    if (title) { fields.push('title =?'); params.push(title); }
    if (description) { fields.push('description =?'); params.push(description); }
    if (status) { fields.push('status =?'); params.push(status); }
    if (priority) { fields.push('priority =?'); params.push(priority); }
    if (assignee_id) { fields.push('assignee_id =?'); params.push(assignee_id); }
    if (due_date) { fields.push('due_date =?'); params.push(due_date); }

    if (fields.length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
    }

    params.push(taskId);
    const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id =?`;

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task updated successfully' });
    });
});

// Delete a task
router.delete('/:id', authenticateToken, (req, res) => {
    const taskId = req.params.id;
    const sql = 'DELETE FROM tasks WHERE id =?';
    db.run(sql, [taskId], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

module.exports = router;
