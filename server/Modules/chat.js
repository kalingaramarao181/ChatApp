const express = require('express');
const router = express.Router();
const db = require('./connection');

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

router.get('/messages/:senderid/:receiverid', (req, res) => {
    const { senderid, receiverid } = req.params;
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


module.exports = router;
