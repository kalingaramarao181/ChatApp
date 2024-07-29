const express = require('express');
const router = express.Router();
const db = require('./connection');
const bcrypt = require('bcrypt'); // Import bcrypt
const { v4: uuidv4 } = require('uuid');

const SALT_ROUNDS = 10; // Number of salt rounds for hashing

const genarateUniqueId = () => {
    uuidv4()
}

// Get all users
router.get('/users', (req, res) => {
    const sql = 'SELECT * FROM userdata';
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(data);
        }
    });
});

// Get a single user by ID
router.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM userdata WHERE id = ?';
    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(data[0]);
        }
    });
});


// Create a new user
router.post('/users', (req, res) => {
    const { fullname, email, password, phoneno, dateofbirth, address } = req.body;
    const userid = genarateUniqueId();
    const lastlogin = "0000-00-00";
    const loginstatus = false;

    // Check if user already exists
    const checkUserSql = 'SELECT * FROM userdata WHERE email = ? OR phoneno = ?';
    db.query(checkUserSql, [email, phoneno], (err, data) => {
        if (err) {
            console.error('Error checking user existence:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (data.length > 0) {
            res.status(400).json({ error: 'User already exists with this email or phone number' });
        } else {
            // Hash the password
            bcrypt.hash(password, SALT_ROUNDS, (err, hashedPassword) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    // Insert new user
                    const sql = 'INSERT INTO userdata (userid, fullname, email, password, phoneno, dateofbirth, address, lastlogin, loginstatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
                    db.query(sql, [userid, fullname, email, hashedPassword, phoneno, dateofbirth, address, lastlogin, loginstatus], (err, result) => {
                        if (err) {
                            console.error('Error creating user:', err);
                            res.status(500).json({ error: 'Internal Server Error' });
                        } else {
                            res.status(201).json({ id: result.insertId, fullname, email });
                        }
                    });
                }
            });
        }
    });
});



// Update an existing user
router.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { fullname, email, password, phoneno, dateofbirth, address } = req.body; // Example fields
    const sql = 'UPDATE userdata SET fullname = ?, email = ?, password = ?, phoneno = ?, dateofbirth = ?, address = ? WHERE id = ?';
    db.query(sql, [fullname, email, password, phoneno, dateofbirth, address, id], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ message: 'User updated successfully' });
        }
    });
});

module.exports = router;
