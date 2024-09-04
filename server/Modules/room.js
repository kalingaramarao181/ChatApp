const express = require('express');
const router = express.Router();
const db = require('../Config/connection');
const bcrypt = require('bcrypt'); // Import bcrypt


//GET ROOM
router.get('/room/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM rooms WHERE roomid = ?';
    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(data[0]);
        }
    });
});

// CREATE NEW ROOM
router.post('/create-room', async (req, res) => {
    const { roomName, createdBy, roomMembers } = req.body;

    const checkRoomSql = 'SELECT * FROM rooms WHERE room_name = ?';
    db.query(checkRoomSql, [roomName], (err, data) => {
        if (err) {
            console.error('Error checking room existence:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (data.length > 0) {
            res.status(400).json({ error: 'Room already exists with this name' });
        } else {
            const insertRoomSql = 'INSERT INTO rooms (room_name, created_by, created_at, members) VALUES (?, ?, NOW(), ?)';

            const membersJson = JSON.stringify(roomMembers);

            db.query(insertRoomSql, [roomName, createdBy, membersJson], (err, result) => {
                if (err) {
                    console.error('Error inserting room:', err);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    res.status(201).json({ message: 'Room created successfully', roomId: result.insertId });
                }
            });
        }
    });
});



//JOIN USER IN ROOM
router.put('/room', async (req, res) => {
    const { roomid, room_name, members, created_at, created_by } = req.body;

    // Validate the input data
    if (!roomid || !room_name || !members || !created_by) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        // Convert members array to JSON string
        const membersJSON = JSON.stringify(members);

        // Update the room details, including members as JSON
        const updateRoomQuery = `
            UPDATE rooms
            SET room_name = ?, members = ?, created_at = ?, created_by = ?
            WHERE roomid = ?;
        `;
        await db.query(updateRoomQuery, [room_name, membersJSON, created_at, created_by, roomid]);

        // Respond with success
        res.status(200).json({ message: "Room updated successfully!" });
    } catch (error) {
        console.error('Error updating room:', error);
        res.status(500).json({ error: "An error occurred while updating the room." });
    }
});


module.exports = router;
