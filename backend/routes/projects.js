// backend/routes/projects.js
const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware');
const router = express.Router();

// Get all projects for the logged-in user
router.get('/', authenticateToken, (req, res) => {
    const sql = `
        SELECT p.id, p.name, p.description 
        FROM projects p
        JOIN memberships m ON p.id = m.project_id
        WHERE m.user_id =?
    `;
    db.all(sql, [req.user.id], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.json(rows);
    });
});

// Create a new project
router.post('/', authenticateToken, (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Project name is required' });
    }

    const projectSql = 'INSERT INTO projects (name, description) VALUES (?,?)';
    db.run(projectSql, [name, description], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        const projectId = this.lastID;
        const membershipSql = 'INSERT INTO memberships (user_id, project_id, role) VALUES (?,?,?)';
        db.run(membershipSql, [req.user.id, projectId, 'Admin'], (memErr) => {
            if (memErr) {
                return res.status(500).json({ message: 'Failed to create membership', error: memErr.message });
            }
            res.status(201).json({ id: projectId, name, description });
        });
    });
});

// Get all tasks for a specific project
router.get('/:id/tasks', authenticateToken, (req, res) => {
    const projectId = req.params.id;
    // First, verify the user is a member of the project
    const checkMembershipSql = 'SELECT * FROM memberships WHERE user_id =? AND project_id =?';
    db.get(checkMembershipSql, [req.user.id, projectId], (err, membership) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (!membership) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const getTasksSql = 'SELECT * FROM tasks WHERE project_id =?';
        db.all(getTasksSql, [projectId], (taskErr, tasks) => {
            if (taskErr) {
                return res.status(500).json({ message: 'Database error', error: taskErr.message });
            }
            res.json(tasks);
        });
    });
});

module.exports = router;
