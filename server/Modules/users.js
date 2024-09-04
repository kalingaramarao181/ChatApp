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

router.get('/room-users/:userIds', (req, res) => {
    const { userIds } = req.params;

    // Split the comma-separated userIds and convert them to integers
    const ids = userIds.split(',').map(id => parseInt(id, 10));

    // Check for invalid IDs
    if (ids.some(isNaN)) {
        return res.status(400).send('Invalid IDs');
    }

    // Generate placeholders for the SQL query
    const placeholders = ids.map(() => '?').join(',');

    // SQL query to select users by ID
    const query = `SELECT * FROM userdata WHERE id IN (${placeholders})`;

    db.query(query, ids, (err, result) => {
        if (err) {
            console.error('Error Fetching users:', err);
            return res.status(500).send('Internal server error');
        }
        res.status(200).send(result);
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
                    DISTINCT r.roomid, 
                    r.room_name, 
                    r.created_at,
                    r.members,
                    r.created_by
                FROM 
                    rooms r
                WHERE 
                    FIND_IN_SET(?, REPLACE(REPLACE(r.members, '[', ''), ']', '')) > 0
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
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { fullname, email, password, phoneno, dateofbirth, address } = req.body; // Example fields
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'UPDATE userdata SET fullname = ?, email = ?, password = ?, phoneno = ?, dateofbirth = ?, address = ? WHERE id = ?';
    db.query(sql, [fullname, email, hashedPassword, phoneno, dateofbirth, address, id], (err, result) => {
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
    
    const deleteMessagesQuery = 'DELETE FROM messages WHERE senderid = ? OR receiverid = ?';
    const deleteUserQuery = 'DELETE FROM userdata WHERE id = ?';

    // First, delete messages where the user is either the sender or receiver
    db.query(deleteMessagesQuery, [id, id], (err, result) => {
        if (err) {
            console.error('Error deleting user messages:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Then, delete the user from userdata
        db.query(deleteUserQuery, [id], (err, result) => {
            if (err) {
                console.error('Error deleting user:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.json({ message: 'User and their messages deleted successfully' });
        });
    });
});

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
