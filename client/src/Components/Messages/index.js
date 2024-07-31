import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chat = ({ userId, contactId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:8080?userId=${userId}`);

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.senderid === contactId || message.receiverid === contactId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.current.close();
    };
  }, [userId, contactId]);

  useEffect(() => {
    axios.get('http://localhost:3000/messages', { params: { senderid: userId, receiverid: contactId } })
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
      });
  }, [userId, contactId]);

  const sendMessage = () => {
    const messageData = { senderid: userId, receiverid: contactId, message: input };
    axios.post('http://localhost:3000/send-message', messageData)
      .then(() => {
        setInput('');
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index} style={{ alignSelf: msg.sender_id === userId ? 'flex-end' : 'flex-start' }}>
            <strong>{msg.sender_id === userId ? 'You' : msg.sender_id}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>

    </div>
  );
};

export default Chat;
