// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name ||!email ||!password) {
        return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (name, email, password) VALUES (?,?,?)';
        db.run(sql, [name, email, hashedPassword], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ message: 'Email already exists' });
                }
                return res.status(500).json({ message: 'Database error', error: err.message });
            }
            res.status(201).json({ message: 'User created successfully', userId: this.lastID });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email ||!password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    const sql = 'SELECT * FROM users WHERE email =?';
    db.get(sql, [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ accessToken });
    });
});

module.exports = router;
