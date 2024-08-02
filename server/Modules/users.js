const express = require('express');
const router = express.Router();
const db = require('./connection');
const bcrypt = require('bcrypt'); // Import bcrypt
const { v4: uuidv4 } = require('uuid');

const genarateUniqueId = () => {
    return uuidv4()
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

//Get chatted users
router.get('/chatted-users/:senderid', (req, res) => {
    const { senderid } = req.params;
    const sql = `
        SELECT DISTINCT 
            userdata.id, 
            userdata.fullname, 
            userdata.email, 
            userdata.phoneno, 
            userdata.lastlogin 
        FROM 
            userdata 
        JOIN 
            messages 
            ON (userdata.id = messages.senderid AND messages.receiverid = ?) 
            OR (userdata.id = messages.receiverid AND messages.senderid = ?)
        WHERE 
            userdata.id != ? 
        ORDER BY 
            messages.timestamp;
    `;

    db.query(sql, [senderid, senderid, senderid], (err, data) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(data);
        }
    });
});

// Create a new user
router.post('/signup-user', async (req, res) => {
    const { fullname, email, password, phoneno, dateofbirth, address } = req.body;
    const userid = genarateUniqueId();
    console.log(fullname);
    const lastlogin = "0000-00-00";
    const loginstatus = false;
    const hashedPassword = await bcrypt.hash(password, 10);

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
