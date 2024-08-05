const express = require('express');
const router = express.Router();
const db = require('./connection');


router.get('/messages', (req, res) => {
    const { senderid, receiverid } = req.query;
    const query = `
      SELECT * FROM messages 
      WHERE (senderid = ? AND receiverid = ?)
         OR (senderid = ? AND receiverid = ?)
      ORDER BY timestamp ASC
    `;
    
    db.query(query, [senderid, receiverid, receiverid, senderid], (err, results) => {
        if (err) {
            console.error('Error fetching messages:', err);
            return res.status(500).send('Internal server error');
        }

        res.json(results);
    });
});

router.put("/message/:messageId", (req, res) => {
    const {messageId} = req.params;
    const {message} = req.body
    const query = `UPDATE messages SET message = ? WHERE id = ?`
    db.query(query, [message, messageId], (err, result) => {
        if (err) {
            console.error('Error ediding message:', err);
            return res.status(500).send('Internal server error');
        }
        res.status(200).send('Message updated');
    })
})

router.delete("/message/:messageId", (req, res) => {
    const {messageId} = req.params;
    const query = `DELETE FROM messages WHERE id = ?`
    db.query(query, [messageId], (err, ressult) => {
        if (err) {
            console.error('Error Deleting message:', err);
            return res.status(500).send('Internal server error');
        }
        res.status(200).send('Message Deleted');
    })
})

router.delete('/selected-messages/:selectedIdsString', (req, res) => {
    const { selectedIdsString } = req.params;
    // Convert the comma-separated string to an array of IDs
    const ids = selectedIdsString.split(',').map(id => parseInt(id, 10));

    if (ids.some(isNaN)) {
        return res.status(400).send('Invalid IDs');
    }

    // Create placeholders for the query
    const placeholders = ids.map(() => '?').join(',');

    // Construct the SQL query with placeholders
    const query = `DELETE FROM messages WHERE id IN (${placeholders})`;

    // Execute the query with the IDs array
    db.query(query, ids, (err, result) => {
        if (err) {
            console.error('Error Deleting messages:', err);
            return res.status(500).send('Internal server error');
        }
        res.status(200).send('Messages Deleted');
    });
});

router.post('/send-message', (req, res) => {
    const { senderid, receiverid, message } = req.body;
    const query = 'INSERT INTO messages (senderid, receiverid, message) VALUES (?, ?, ?)';
    db.query(query, [senderid, receiverid, message], (err, result) => {
        if (err) {
            console.error('Error inserting message:', err);
            return res.status(500).send('Internal server error');
        }
        res.status(200).send('Message sent');
    });
});


module.exports = router;
