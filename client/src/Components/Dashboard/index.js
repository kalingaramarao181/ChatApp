import React, { useState, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { BsFillSendFill } from 'react-icons/bs';
import axios from 'axios';
import { baseUrl } from '../config'; // Ensure you have your baseUrl defined in the config file
import './index.css';  // Assuming you have your styles here
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoIosShareAlt } from "react-icons/io";

const Dashboard = () => {
  const senderData = JSON.parse(localStorage.getItem('senderData')) || { id: 1, fullname: 'John Doe' };

  const [message, setMessage] = useState({
    senderid: senderData.id,
    receiverid: 0,
    message: ''
  });
  const [chatUsersData, setChatUsersData] = useState([]);
  const [chat, setChat] = useState([]);
  const [chattingUser, setChattingUser] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [viewEdit, setViewEdit] = useState(false)
  const [editBarView, setEditBarView] = useState(false)
  const [selectInput, setSelectInput] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [isSelectMessageEdit, setIsSelectMessageEdit] = useState(false)
  const [editMessage, setEditMessage] = useState({ message: "", messageId: 0 });






  useEffect(() => {
    axios.get(`${baseUrl}chatted-users/${senderData.id}`)
      .then((res) => {
        setChatUsersData(res.data);
        setMessage(prevMessage => ({ ...prevMessage, receiverid: res.data[0]?.id || 0 }));
      })
      .catch(err => {
        console.log(err);
      });
  }, [senderData.id]);

  useEffect(() => {
    if (message.receiverid) {
      axios.get(`${baseUrl}messages/${message.senderid}/${message.receiverid}`)
        .then((res) => {
          setChat(res.data);
        })
        .catch((err) => {
          console.log('Error fetching messages:', err);
        });
    }
  }, [message.senderid, message.receiverid]);

  const handleMessageChange = (e) => {
    setMessage({ ...message, message: e.target.value });
  };

  const handleEditMessageChange = (e) => {
    setEditMessage({ ...editMessage, message: e.target.value })
  }

  const handleEditMessageSend = () => {
    axios.put(`${baseUrl}message/${editMessage.messageId}`, { message: editMessage.message })
      .then((res) => {
        setEditMessage(prevMessage => ({ ...prevMessage, message: '' })); // Clear the input after sending
        window.location.reload()
      })
      .catch(err => {
        console.log('Error sending message:', err.response ? err.response.data : err.message);
      });

  }

  const onEmojiClick = (event, emojiObject) => {
    console.log(emojiObject);
    setMessage(prevMessage => ({
      ...prevMessage,
      message: prevMessage.message + emojiObject.emoji
    }));
  };

  const handleClickSend = () => {
    axios.post(`${baseUrl}send-message`, message)
      .then((res) => {
        setChat([...chat, { ...message }]); // Update chat with new message
        setMessage(prevMessage => ({ ...prevMessage, message: '' })); // Clear the input after sending
      })
      .catch(err => {
        console.log('Error sending message:', err.response ? err.response.data : err.message);
      });
  };

  const handleMessageEdit = (messageId, message) => {
    setEditMessage({ ...editMessage, messageId, message })
    setIsSelectMessageEdit(true)
    setEditBarView(false)
  }

  const handleMessageSelect = (messageId) => {
    setSelectInput(true)
    setEditBarView(false)

  }

  const onSelectMessage = (e) => {
    console.log(e.target.checked, e.target.id);

    if (e.target.checked && e.target.id) {
      // Add the selected id to the array
      setSelectedIds(prevSelectedIds => [...prevSelectedIds, e.target.id]);
    } else if (!e.target.checked && e.target.id) {
      // Remove the unselected id from the array
      setSelectedIds(prevSelectedIds => prevSelectedIds.filter(id => id !== e.target.id));
    }
  }

  const onClickDeleteSelected = () => {
    const selectedIdsString = selectedIds.join(",");  // Convert array to comma-separated string

    axios.delete(`${baseUrl}selected-messages/${selectedIdsString}`)
      .then((res) => {
        console.log(res.data);  // Log the successful response data
        window.location.reload();  // Optionally reload the page
      })
      .catch(err => {
        console.error('Error deleting messages:', err.response ? err.response.data : err.message);  // Log error
      });
  }

  const handleMessageDelete = (messageId) => {
    axios.delete(`${baseUrl}message/${messageId}`)
      .then((res) => {
        console.log(res.data);
        setEditBarView(false)
        window.location.reload()
      })
      .catch(err => {
        console.log('Error deleting message:', err.response ? err.response.data : err.message);
      });

  }

  const handleClickSendUser = (id, user) => {
    setMessage(prevMessage => ({ ...prevMessage, receiverid: id }));
    setChattingUser(user);
  };

  return (
    <div className='dashboard-total-container'>
      <div className='dashboard-main-container'>
        <div className='dashboard-profil-container'>
          <h1 className='dashboard-profil-heading'>{senderData.fullname}</h1>
        </div>

        {chatUsersData.map(eachUser => (
          <button
            key={eachUser.id}
            onClick={() => handleClickSendUser(eachUser.id, eachUser)}
            className={eachUser.id === message.receiverid ? 'dashboard-profil-container-3' : 'dashboard-profil-container-2'}
          >
            <p className='dashboard-profil-icon'>
              {eachUser.fullname.split(" ")[0][0] + eachUser.fullname.split(" ")[1][0]}
            </p>
            <h1 className='dashboard-profil-heading'>{eachUser.fullname}</h1>
          </button>
        ))}
      </div>
      <div className='dashboard-chat-container'>
        <div>
          <h1>{chattingUser.fullname}</h1>
        </div>
        <div className='chat-container'>
          <div className='dashboard-chat-box-container'>
            {chat.map((eachMessage, index) => (
              <>
                <p className='message' onMouseEnter={() => setViewEdit(eachMessage.id)} onMouseLeave={() => setViewEdit(false)} key={index} style={{ alignSelf: eachMessage.senderid === senderData.id ? 'flex-end' : 'flex-start' }}>
                  {selectInput && <input id={eachMessage.id} onChange={onSelectMessage} type='checkbox' />}
                  {eachMessage.message} {viewEdit === eachMessage.id && <button onClick={() => setEditBarView(eachMessage.id)} className='message-feature-button'><FaRegEdit /></button>}
                </p>
                {editBarView === eachMessage.id &&
                  <div className='edit-bar-container' style={{ alignSelf: eachMessage.senderid === senderData.id ? 'flex-end' : 'flex-start' }}>
                    <button onClick={() => handleMessageEdit(eachMessage.id, eachMessage.message)} className='edit-bar-button'>Edit</button>
                    <button onClick={() => handleMessageSelect(eachMessage.id)} className='edit-bar-button'>Select</button>
                    <button onClick={() => handleMessageDelete(eachMessage.id)} className='edit-bar-button'>Delete</button>
                  </div>
                }
              </>
            ))}
          </div>
          {showEmojiPicker && <EmojiPicker className='emoji-input' onEmojiClick={onEmojiClick} />}
        </div>
        <div className='dashboard-chat-main-container'>
          {selectInput ? <div className='dashboard-input-elements-container'>
            <p>Selected {selectedIds.length}</p>
            <button className='dashboard-button' onClick={onClickDeleteSelected}>
              <MdDelete className='dashboard-text-emoji-container-send' />
            </button>
            <button className='dashboard-button'>
              <IoIosShareAlt className='dashboard-text-emoji-container-send' />
            </button>
          </div> : isSelectMessageEdit ? <div className='dashboard-input-elements-container'>
            <input
              type='text'
              placeholder='Message-Here'
              value={editMessage.message}
              className='dashboard-input-text'
              onChange={handleEditMessageChange}
            />
            <button className='dashboard-button' onClick={handleEditMessageSend}>
              <BsFillSendFill className='dashboard-text-emoji-container-send' />
            </button>
          </div> : <div className='dashboard-input-elements-container'>
            <input
              type='text'
              placeholder='Message-Here'
              value={message.message}
              className='dashboard-input-text'
              onChange={handleMessageChange}
            />
            <button className='dashboard-button' onClick={handleClickSend}>
              <BsFillSendFill className='dashboard-text-emoji-container-send' />
            </button>
          </div>}
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className='dashboard-text-emoji-button'>😀</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
