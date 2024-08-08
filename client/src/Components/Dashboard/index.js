import React, { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { BsFillSendFill } from 'react-icons/bs';
import axios from 'axios';
import { baseUrl } from '../config'; // Ensure you have your baseUrl defined in the config file
import './index.css';  // Assuming you have your styles here
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoIosShareAlt } from "react-icons/io";
import { IoPersonAddOutline } from "react-icons/io5";
import { FiArrowLeftCircle } from "react-icons/fi";
import { CopyToClipboard } from 'react-copy-to-clipboard';

const Dashboard = () => {
  const senderData = JSON.parse(localStorage.getItem('senderData')) || { id: 1, fullname: 'John Doe' };
  const [message, setMessage] = useState({ senderid: senderData.id, receiverid: 0, message: '', timeStamp: new Date() });
  const [editMessage, setEditMessage] = useState({ message: "", messageId: 0 });
  const [chattingUser, setChattingUser] = useState({});
  const [chat, setChat] = useState([]);
  const [usersData, setUsersData] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [unreadCounts, setUnreadCounts] = useState([]);
  const [chatUsersData, setChatUsersData] = useState([]);
  const [viewEdit, setViewEdit] = useState(false)
  const [usersView, setUsersView] = useState(false)
  const [editBarView, setEditBarView] = useState(false)
  const [selectInput, setSelectInput] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSelectMessageEdit, setIsSelectMessageEdit] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const chatEndRef = useRef(null);


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
    axios.get(`${baseUrl}users`)
      .then((res) => {
        setUsersData(res.data);
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

    if (e.target.checked && e.target.id) {
      setSelectedIds(prevSelectedIds => [...prevSelectedIds, e.target.id]);
    } else if (!e.target.checked && e.target.id) {
      setSelectedIds(prevSelectedIds => prevSelectedIds.filter(id => id !== e.target.id));
    }
  }

  const onClickDeleteSelected = () => {
    const selectedIdsString = selectedIds.join(",");

    axios.delete(`${baseUrl}selected-messages/${selectedIdsString}`)
      .then((res) => {
        console.log(res.data);
        window.location.reload();
      })
      .catch(err => {
        console.error('Error deleting messages:', err.response ? err.response.data : err.message);  // Log error
      });
  }

  const handleMessageDelete = (messageId) => {
    axios.delete(`${baseUrl}message/${messageId}`)
      .then((res) => {
        setEditBarView(false)
        window.location.reload()
      })
      .catch(err => {
        console.log('Error deleting message:', err.response ? err.response.data : err.message);
      });

  }

  const fetchUnreadMessages = async (receiverid) => {
    try {
      const res = await axios.get(`${baseUrl}messages/${message.senderid}/${receiverid}`);
      const unreadMessages = res.data.filter(eachMessage => eachMessage.senderid === receiverid && !eachMessage.read);
      return unreadMessages.map(msg => msg.id); // Return the ids of unread messages
    } catch (err) {
      console.log('Error fetching messages:', err);
      return [];
    }
  };

  const handleClickSendUser = async (id, user) => {
    setMessage(prevMessage => ({ ...prevMessage, receiverid: id }));
    setChattingUser(user);
    const unreadMessageIds = await fetchUnreadMessages(id);

    if (unreadMessageIds.length > 0) {
      axios.put(`${baseUrl}read-message`, { messageIds: unreadMessageIds })
        .then(res => {
          console.log('Messages marked as read:', res.data);
          fetchUnreadCounts(); // Update unread counts
        })
        .catch(err => {
          console.log('Error marking messages as read:', err);
        });
    }
    setSelectInput(false)
  };

  const handleClickSelectUser = (id, user) => {
    const isPresent = chatUsersData.some(obj => obj.id === user.id);
    setChatUsersData(!isPresent ? [...chatUsersData, user] : [...chatUsersData])
    setMessage(prevMessage => ({ ...prevMessage, receiverid: id }));
    setChattingUser(user);
    setUsersView(false)
  };

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  const fetchUnreadCounts = () => {
    chatUsersData.forEach((user) => {
      axios.get(`${baseUrl}messages/${message.senderid}/${user.id}`)
        .then((res) => {
          const unreadCount = res.data.filter(eachMessage => eachMessage.senderid === user.id && !eachMessage.read).length;
          setUnreadCounts(prevCounts => ({ ...prevCounts, [user.id]: unreadCount }));
        })
        .catch((err) => {
          console.log('Error fetching messages:', err);
        });
    });
  };

  useEffect(() => {
    if (chatUsersData.length > 0) {
      fetchUnreadCounts();
    }
  }, [chatUsersData,]);


  const searchUsersData = usersData.filter(eachUser => eachUser.fullname.trim().toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) && eachUser.id !== senderData.id)


  const allUsers = () => {
    return (
      <div className='dashboard-sidebar-main-container'>
        <div className='sidebar-profile-container'>
          <button onClick={() => setUsersView(false)} className='back-button'><FiArrowLeftCircle /></button>
          <input onChange={(e) => setSearchValue(e.target.value)} type='search' className='search-input' placeholder='Search Users' />
        </div>
        <div className='chatted-users-container'>
          {searchUsersData.map(eachUser => (
            <button
              key={eachUser.id}
              onClick={() => handleClickSelectUser(eachUser.id, eachUser)}
              className={eachUser.id === message.receiverid ? 'sidebar-profil-container-active' : 'sidebar-profil-container-inactive'}
            >
              <p className='sidebar-profile-icon'>
                {eachUser.fullname.split(" ").length >= 1 ? eachUser.fullname.split(" ")[0][0] + eachUser.fullname.split(" ")[1][0] : eachUser.fullname[0]}
              </p>
              <h1 className='sidebar-profile-heading'>{eachUser.fullname}</h1>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const chattedUsers = () => {
    return (
      <div className='dashboard-sidebar-main-container'>
        <div className='sidebar-profile-container'>
          <h1 className='sidebar-profile-heading'>{senderData.fullname}</h1>
          <button onClick={() => setUsersView(true)} className='sidebar-profile-icon'><IoPersonAddOutline /></button>
        </div>
        <div className='chatted-users-container'>
          {chatUsersData.map(eachUser => {
            return (
              <><button
                key={eachUser.id}
                onClick={() => handleClickSendUser(eachUser.id, eachUser)}
                className={eachUser.id === message.receiverid ? 'sidebar-profil-container-active' : 'sidebar-profil-container-inactive'}
              >
                <p className="sidebar-profile-icon">
                  {eachUser.fullname.split(" ").length >= 1
                    ? eachUser.fullname.split(" ")[0][0] + eachUser.fullname.split(" ")[1][0]
                    : eachUser.fullname[0]}
                  {eachUser.loginstatus === 1 && <span className="status-dot"></span>}
                </p>
                <h1 className='sidebar-profile-heading'>{eachUser.fullname}</h1>
                {unreadCounts[eachUser.id] !== 0 && <span className='unread-count'>{unreadCounts[eachUser.id]}</span>}
              </button>
              </>
            )
          })}
        </div>
      </div>
    )
  }

  const inputBarSelectedFeaturesView = () => {
    return (
      <div className='dashboard-input-elements-container-select-stage'>
        <p className='selected-items'>Selected {selectedIds.length}</p>
        <div className='share-delete-container'>
          <button className='dashboard-button' onClick={onClickDeleteSelected}>
            <MdDelete className='dashboard-text-emoji-container-send' />
          </button>

          <button className='dashboard-button'>
            <IoIosShareAlt className='dashboard-text-emoji-container-send' />
          </button>
        </div>
      </div>)
  }

  const messageFeatures = (eachMessage) => {
    return (
      <div className='edit-bar-container' style={{ alignSelf: eachMessage.senderid === senderData.id ? 'flex-end' : 'flex-start' }}>
        {eachMessage.senderid === senderData.id && <button onClick={() => handleMessageEdit(eachMessage.id, eachMessage.message)} className='edit-bar-button'>Edit</button>}
        <button onClick={() => handleMessageSelect(eachMessage.id)} className='edit-bar-button'>Select</button>
        <button onClick={() => handleMessageDelete(eachMessage.id)} className='edit-bar-button'>Delete</button>
        <CopyToClipboard text={eachMessage.message}>
          <button onClick={() => alert('Text copied!')} className='edit-bar-button'>Copy</button>
        </CopyToClipboard>
      </div>
    )
  }

  const inputBarEditView = () => {
    return (
      <div className='dashboard-input-elements-container'>
        <input
          type='text'
          placeholder='Type your message...'
          value={editMessage.message}
          className='dashboard-input-text'
          onChange={handleEditMessageChange}
        />
        <button className='dashboard-button' onClick={handleEditMessageSend}>
          <BsFillSendFill className='dashboard-text-emoji-container-send' />
        </button>
      </div>
    )
  }

  const inputBarMessageView = () => {
    return (
      <div className='dashboard-input-elements-container'>
        <input
          type='text'
          placeholder='Type your message...'
          value={message.message}
          className='dashboard-input-text'
          onChange={handleMessageChange}
        />
        <button className='dashboard-button' onClick={handleClickSend}>
          <BsFillSendFill className='dashboard-text-emoji-container-send' />
        </button>
      </div>
    )
  }







  return (
    <div className='dashboard-total-container'>
      {usersView ? allUsers() : chattedUsers()}
      <div className='dashboard-chat-container'>
          <h1 className='name-search'>{chattingUser.fullname ? chattingUser.fullname : chatUsersData.length >= 1 && chatUsersData[0].fullname}
            {chattingUser.fullname && chattingUser.loginstatus ? <span className='last-seen-online'> Online</span> : <span className='last-seen'> Last seen at {chattingUser.lastseen ? formatAMPM(new Date(chattingUser.lastseen)) : chatUsersData.length >= 1 && formatAMPM(new Date(chatUsersData[0].lastseen))}</span>}
          </h1>
        <div className='chat-container'>
          <div className='dashboard-chat-box-container'>
            {chat.map((eachMessage, index) => {
              const timeStamp = new Date(eachMessage.timestamp)
              const time = formatAMPM(timeStamp)
              return <>
                <div className='message-input-container' style={{ alignSelf: eachMessage.senderid === senderData.id ? 'flex-end' : 'flex-start' }}>
                  {selectInput && <input className='select-input' id={eachMessage.id} onChange={onSelectMessage} type='checkbox' />}
                  <p className={eachMessage.senderid === senderData.id ? 'message-sender' : 'message-receiver'} onMouseEnter={() => setViewEdit(eachMessage.id)} onMouseLeave={() => setViewEdit(false)} key={index}>
                    <span className='message-span'>{eachMessage.message}</span>
                    <div className='message-time-container'>
                      {viewEdit === eachMessage.id ? <button onClick={() => setEditBarView(eachMessage.id)} style={{ color: eachMessage.senderid === senderData.id ? 'white' : 'black' }} className='message-feature-button'><FaRegEdit /></button> : <p className='message-feature-empty-button'>
                        </p>}
                      <span className='time-span'>{time}</span>
                    </div>
                  </p>
                </div>
                {editBarView === eachMessage.id && messageFeatures(eachMessage)}
              </>
            }
            )}
            <div ref={chatEndRef} />

          </div>
          {showEmojiPicker && <EmojiPicker className='emoji-input' onEmojiClick={onEmojiClick} />}
        </div>
        <div className='dashboard-chat-main-container'>
          {selectInput ? inputBarSelectedFeaturesView() : isSelectMessageEdit ? inputBarEditView() : inputBarMessageView()
          }
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className='dashboard-text-emoji-button'>😀</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;