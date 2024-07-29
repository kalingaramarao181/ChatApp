const express = require('express');
const router = express.Router();
const db = require('./connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

// Login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const checkUserSql = 'SELECT * FROM userdata WHERE username = ?';

    db.query(checkUserSql, [username], (err, data) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (data.length === 0) {
            res.status(404).json({ error: 'No user found' });
        } else {
            const user = data[0];
            // Compare provided password with hashed password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else if (!isMatch) {
                    res.status(401).json({ error: 'Wrong credentials' });
                } else {
                    const loginTime = new Date();
                    const updateSql = 'UPDATE userdata SET lastlogin = ? WHERE id = ?';
                    db.query(updateSql, [loginTime, user.id], (updateErr, updateData) => {
                        if (updateErr) {
                            console.error('Error updating login time:', updateErr);
                            res.status(500).json({ error: 'Internal Server Error' });
                        } else {
                            // Generate JWT token
                            const token = jwt.sign(
                                { id: user.id, username: user.username },
                                JWT_SECRET,
                                { expiresIn: '1h' } // Token expires in 1 hour
                            );
                            res.json({ message: 'Login successful', user, token });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
