const express = require('express');
const router = express.Router();
const db = require('../Config/connection');
const bcrypt = require('bcrypt'); // Import bcrypt
const { v4: uuidv4 } = require('uuid');

const genarateUniqueId = () => {
    return uuidv4()
}

//GET ALL USERS
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

//GET A SINGLE USER BY ID
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

//GET CHATTED USERS
router.get('/chatted-users/:senderid', (req, res) => {
    const { senderid } = req.params;

    const userSql = `
    SELECT 
        DISTINCT userdata.id, 
        userdata.fullname, 
        userdata.email, 
        userdata.phoneno, 
        userdata.lastlogin,
        userdata.lastseen,
        userdata.loginstatus
    FROM 
        userdata 
    JOIN 
        messages 
        ON (userdata.id = messages.senderid AND messages.receiverid = ?) 
        OR (userdata.id = messages.receiverid AND messages.senderid = ?)
    WHERE 
        userdata.id != ? 
    ORDER BY 
        (SELECT MAX(timestamp) 
        FROM messages 
        WHERE (messages.senderid = userdata.id AND messages.receiverid = ?) 
            OR (messages.receiverid = userdata.id AND messages.senderid = ?)
        ) DESC;
    `;

    const roomSql = `
    SELECT 
        DISTINCT r.room_id, 
        r.room_name, 
        r.created_at,
        r.members,
        r.created_by
    FROM 
        rooms r
    WHERE 
        JSON_CONTAINS(r.members, JSON_QUOTE(?), '$') = 1
        OR r.created_by = ?
    `;

    db.query(userSql, [senderid, senderid, senderid, senderid, senderid], (err, userData) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Internal Server Error while fetching users' });
        }

        db.query(roomSql, [senderid, senderid], (err, roomData) => {
            if (err) {
                console.error('Error fetching rooms:', err);
                return res.status(500).json({ error: 'Internal Server Error while fetching rooms' });
            }

            res.json({
                users: userData,
                rooms: roomData
            });
        });
    });
});


//CREATE NEW USER
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



// UPDATE EXISTING USER
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

router.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM userdata WHERE id = ?'
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error delete user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ message: 'User Deleted successfully' });
        }
    });
})

// UPDATING AN EXISTING USER PASSWORD
router.put('/update-password', async (req, res) => {
    const { email, password } = req.body; // Example fields

    console.log('Email:', email);
    console.log('Password:', password);

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'UPDATE userdata SET password = ? WHERE email = ?';
        db.query(sql, [hashedPassword, email], (err, result) => {
            if (err) {
                console.error('Error updating user:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.json({ message: 'Password updated successfully' });
            }
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//UPDATE LOGOUT STATUS
router.put('/update-logout/:id', (req, res) => {
    const { id } = req.params;
    const date = new Date()
    const sql = 'UPDATE userdata SET lastseen = ?, loginstatus = ? WHERE id = ?';
    db.query(sql, [date, false, id], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ message: 'User updated successfully' });
        }
    });
});

module.exports = router;
