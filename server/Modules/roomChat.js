const express = require('express');
const router = express.Router();
const db = require('../Config/connection');
const upload = require('../Config/multer'); // Import multer middleware

//GET MESSAGES USING USER_ID AND RECEIVER_ID
router.get('/room-messages/:senderid/:roomid', (req, res) => {
    const { roomid } = req.params;

    const query = `
    SELECT * FROM room_messages 
    WHERE  roomid = ?
    ORDER BY timestamp ASC
  `;
    const values = [roomid];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error fetching messages:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

//SEND MESSAGE TO DATABASE
router.post('/send-room-message', upload.single('file'), (req, res) => {
    const { senderid, roomid, message } = req.body;
    const file = req.file; 

    // Use a single query string
    const query = 'INSERT INTO room_messages (senderid, roomid, message, file) VALUES (?, ?, ?, ?)';

    // If no file is uploaded, use NULL for the file field
    const values = [
        senderid,
        roomid,
        message,
        file ? file.path : null
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting message:', err);
            return res.status(500).send('Internal server error');
        }
        res.status(200).send('Message sent');
    });
});

//DELETE USER MESSAGE
router.post('/delete-room-message', (req, res) => {
    const { messageId, userId } = req.body;
    const query = `
      UPDATE messages 
      SET deleted_by_sender = IF(senderid = ?, TRUE, deleted_by_sender),
          deleted_by_receiver = IF(roomid = ?, TRUE, deleted_by_receiver)
      WHERE id = ? AND (senderid = ? OR roomid = ?)
    `;
    db.query(query, [userId, userId, messageId, userId, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete message' });
        }
        res.status(200).json({ message: 'Message deleted successfully' });
    });
});

//DELETE SELECTED MESSAGES
router.post('/delete-selected-room-messages', (req, res) => {
    const { selectedIdsString, userId } = req.body;

    const ids = selectedIdsString.split(',').map(id => parseInt(id, 10));

    if (ids.some(isNaN)) {
        return res.status(400).send('Invalid IDs');
    }

    const placeholders = ids.map(() => '?').join(',');

    const query = `
      UPDATE messages 
      SET deleted_by_sender = IF(senderid = ?, TRUE, deleted_by_sender),
          deleted_by_receiver = IF(roomid = ?, TRUE, deleted_by_receiver)
      WHERE id IN (${placeholders}) AND (senderid = ? OR roomid = ?)
    `;

    db.query(query, [userId, userId, ...ids, userId, userId], (err, result) => {
        if (err) {
            console.error('Error Deleting messages:', err);
            return res.status(500).send('Internal server error');
        }
        res.status(200).send('Messages Deleted');
    });
});

//EDIT MESSAGE
router.put("/room-message/:messageId", (req, res) => {
    const { messageId } = req.params;
    const { message } = req.body;
    const query = `UPDATE messages SET message = ? WHERE id = ?`;
    db.query(query, [message, messageId], (err, result) => {
        if (err) {
            console.error('Error editing message:', err);
            return res.status(500).send('Internal server error');
        }
        res.status(200).send('Message updated');
    });
});

//UPDATE READ MESSAGE
router.put("/read-room-message", (req, res) => {
    const { messageIds } = req.body;

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
        return res.status(400).send('No message IDs provided');
    }

    // Create a placeholder string for the `IN` clause
    const placeholders = messageIds.map(() => '?').join(',');
    const query = `UPDATE messages SET \`read\` = ? WHERE id IN (${placeholders})`;

    // Use messageIds array as values for the placeholders
    const values = [true, ...messageIds];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating messages:', err);
            return res.status(500).send('Internal server error');
        }
        res.status(200).send('Messages updated');
    });
});

//DELETE MESSAGE (NOT IN USE)
router.delete("/room-message/:messageId", (req, res) => {
    const { messageId } = req.params;
    const query = `DELETE FROM messages WHERE id = ?`;
    db.query(query, [messageId], (err, result) => {
        if (err) {
            console.error('Error Deleting message:', err);
            return res.status(500).send('Internal server error');
        }
        res.status(200).send('Message Deleted');
    });
});

//DELETE SELECTED MESSAGES (NOT IN USE)
router.delete('/selected-room-messages/:selectedIdsString', (req, res) => {
    const { selectedIdsString } = req.params;
    const ids = selectedIdsString.split(',').map(id => parseInt(id, 10));

    if (ids.some(isNaN)) {
        return res.status(400).send('Invalid IDs');
    }

    const placeholders = ids.map(() => '?').join(',');

    const query = `DELETE FROM messages WHERE id IN (${placeholders})`;

    db.query(query, ids, (err, result) => {
        if (err) {
            console.error('Error Deleting messages:', err);
            return res.status(500).send('Internal server error');
        }
        res.status(200).send('Messages Deleted');
    });
});

module.exports = router;
