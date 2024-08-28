const express = require('express');
const router = express.Router();
const db = require('../Config/connection');
const bcrypt = require('bcrypt'); // Import bcrypt


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
router.put('/join-room/:userid/:roomid', (req, res) => {
    const { userid, roomid } = req.params;
    const getRoomSql = 'SELECT members FROM rooms WHERE room_id = ?';
    db.query(getRoomSql, [roomid], (err, result) => {
        if (err) {
            console.error('Error fetching room data:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }if (result.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }
        const currentMembers = JSON.parse(result[0].members || '[]');

        if (currentMembers.includes(userid)) {
            return res.status(400).json({ error: 'User already in the room' });
        }

        currentMembers.push(userid);

        const updateRoomSql = 'UPDATE rooms SET members = ? WHERE room_id = ?';

        db.query(updateRoomSql, [JSON.stringify(currentMembers), roomid], (err, result) => {
            if (err) {
                console.error('Error updating room members:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.status(200).json({ message: 'User added to room successfully' });
        });
    });
});


module.exports = router;
