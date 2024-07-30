const WebSocket = require('ws');
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const wss = new WebSocket.Server({ port: 4000 });

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chatapp'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

let clients = {}; // Store clients with their user ID

wss.on('connection', (ws, req) => {
  const userId = req.url.split('?userId=')[1]; // Assuming user ID is passed as a query param

  clients[userId] = ws;

  ws.on('close', () => {
    delete clients[userId];
  });
});

// Endpoint to receive new messages and broadcast them
app.post('/send-message', (req, res) => {
  const { sender_id, receiver_id, message } = req.body;

  const query = 'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)';
  db.query(query, [sender_id, receiver_id, message], (err, result) => {
    if (err) {
      console.error('Error inserting message:', err);
      return res.status(500).send('Internal server error');
    }

    const messageData = { sender_id, receiver_id, message };

    // Send message to the receiver if connected
    if (clients[receiver_id]) {
      clients[receiver_id].send(JSON.stringify(messageData));
    }

    // Optionally send an acknowledgment to the sender
    if (clients[sender_id]) {
      clients[sender_id].send(JSON.stringify(messageData));
    }

    res.status(200).send('Message sent');
  });
});

// Endpoint to fetch conversation between two users
app.get('/messages', (req, res) => {
  const { userId1, userId2 } = req.query;

  const query = `
    SELECT * FROM messages 
    WHERE (senderid = ? AND receiverid = ?) 
       OR (senderid = ? AND receiverid = ?)
    ORDER BY timestamp ASC
  `;
  db.query(query, [userId1, userId2, userId2, userId1], (err, results) => {
    if (err) {
      console.error('Error fetching messages:', err);
      return res.status(500).send('Internal server error');
    }

    res.json(results);
  });
});

app.listen(3000, () => {
  console.log('HTTP server listening on port 3000');
});
