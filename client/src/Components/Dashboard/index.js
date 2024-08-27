import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import { BsFillSendFill } from 'react-icons/bs';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoIosShareAlt } from "react-icons/io";
import { IoPersonAddOutline } from "react-icons/io5";
import { FiArrowLeftCircle } from "react-icons/fi";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { IoCheckmarkDone } from "react-icons/io5";
import { IoCheckmarkOutline } from "react-icons/io5";
import { FaCaretSquareDown } from "react-icons/fa";
import { FaCaretSquareUp } from "react-icons/fa";
import { formatAMPM } from '../Functions/formatAMPM';
import { MdKeyboardBackspace } from "react-icons/md";
import { GoFileMedia } from "react-icons/go";
import { FaFileAlt } from "react-icons/fa";
import { baseUrl, showFileUrl } from '../config';
import './index.css';

const Dashboard = () => {
  const senderData = JSON.parse(localStorage.getItem('senderData')) || { id: 1, fullname: 'John Doe' };
  const [message, setMessage] = useState({ senderid: senderData.id, receiverid: 0, message: '', timeStamp: new Date(), file: "uploads/1724784872110.pdf" });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
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
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleContainer = () => {
    setIsExpanded(!isExpanded);
  };


  // Function to fetch messages
  const fetchMessages = () => {
    if (message.receiverid) {
      axios.get(`${baseUrl}messages/${message.senderid}/${message.receiverid}`)
        .then((res) => {
          setChat(res.data);
        })
        .catch((err) => {
          console.log('Error fetching messages:', err);
        });
    }
  };

  // Fetch messages initially and set up polling
  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [message.senderid, message.receiverid]);

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // Set the file in both states
    setSelectedFile(file);
    setMessage({ ...message, file: file });

    // Check if the file is an image for preview
    if (file && /\.(jpg|jpeg|png|gif)$/i.test(file.name)) {
      const fileUrl = URL.createObjectURL(file);  // Create a URL for image preview
      setPreviewUrl(fileUrl);                     // Set preview URL
    } else {
      setPreviewUrl(null);  // Clear preview if not an image
    }
  };

  const handleEditMessageSend = (e) => {
    e.preventDefault();
    if (editMessage.message !== "") {
      axios.put(`${baseUrl}message/${editMessage.messageId}`, { message: editMessage.message })
        .then((res) => {
          setEditMessage(prevMessage => ({ ...prevMessage, message: '' }));
          fetchMessages(); // Fetch updated messages after editing
        })
        .catch(err => {
          console.log('Error sending message:', err.response ? err.response.data : err.message);
        });
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessage(prevMessage => ({
      ...prevMessage,
      message: prevMessage.message + emojiObject.emoji
    }));
  };

  const handleClickSend = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('senderid', message.senderid);
    formData.append('receiverid', message.receiverid);
    formData.append('message', message.message);
    formData.append('timeStamp', message.timeStamp);

    // Ensure file exists before appending
    if (message.file) {
      formData.append('file', message.file); // Append file if it exists
    }

    axios.post(`${baseUrl}send-message`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        setChat([...chat, { ...res.data }]); // Push the response data (message) to chat
        setMessage(prevMessage => ({ ...prevMessage, message: '', file: null })); // Reset message and file after sending
        fetchMessages(); // Fetch updated messages
        setSelectedFile(null)
      })
      .catch(err => {
        console.log('Error sending message:', err.response ? err.response.data : err.message);
      });
  };

  const handleMessageEdit = (messageId, message) => {
    setEditMessage({ ...editMessage, messageId, message });
    setIsSelectMessageEdit(true);
    setEditBarView(false);
  };

  const handleMessageSelect = (messageId) => {
    setSelectInput(true);
    setEditBarView(false);
  };

  const onSelectMessage = (e) => {
    if (e.target.checked && e.target.id) {
      setSelectedIds(prevSelectedIds => [...prevSelectedIds, e.target.id]);
    } else if (!e.target.checked && e.target.id) {
      setSelectedIds(prevSelectedIds => prevSelectedIds.filter(id => id !== e.target.id));
    }
  };

  const onClickDeleteSelected = () => {
    const selectedIdsString = selectedIds.join(",");
    axios.post(`${baseUrl}delete-selected-messages`, { selectedIdsString, userId: senderData.id })
      .then((res) => {
        fetchMessages();
        setSelectInput(false)
      })
      .catch(err => {
        console.log('Error deleting messageS:', err.response ? err.response.data : err.message);
      });
  };

  const handleMessageDelete = (messageId) => {
    axios.post(`${baseUrl}delete-message`, { messageId, userId: senderData.id })
      .then((res) => {
        setEditBarView(false);
        fetchMessages(); // Fetch updated messages after deletion
      })
      .catch(err => {
        console.log('Error deleting message:', err.response ? err.response.data : err.message);
      });
  };

  const fetchUnreadMessages = async (receiverid) => {
    try {
      const res = await axios.get(`${baseUrl}messages/${message.senderid}/${receiverid}`);
      const unreadMessages = res.data.filter(eachMessage => eachMessage.senderid === receiverid && !eachMessage.read);
      return unreadMessages.map(msg => msg.id);
    } catch (err) {
      console.log('Error fetching messages:', err);
      return [];
    }
  };

  const handleClickChattedUser = async (id, user) => {
    setMessage(prevMessage => ({ ...prevMessage, receiverid: id }));
    setChattingUser(user);
    const unreadMessageIds = await fetchUnreadMessages(id);
    if (unreadMessageIds.length > 0) {
      axios.put(`${baseUrl}read-message`, { messageIds: unreadMessageIds })
        .then(res => {
          console.log('Messages marked as read:', res.data);
          fetchUnreadCounts();
        })
        .catch(err => {
          console.log('Error marking messages as read:', err);
        });
    }
    setSelectInput(false);
  };

  const handleClickSelectUser = (id, user) => {
    const isPresent = chatUsersData.some(obj => obj.id === user.id);
    setChatUsersData(!isPresent ? [...chatUsersData, user] : [...chatUsersData]);
    setMessage(prevMessage => ({ ...prevMessage, receiverid: id }));
    setChattingUser(user);
    setUsersView(false);
  };


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
  }, [chatUsersData, message.senderid]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);


  const searchUsersData = usersData.filter(eachUser => eachUser.fullname.trim().toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) && eachUser.id !== senderData.id)


  const allUsers = () => {
    return (
      <div className='dashboard-sidebar-main-container'>
        <div className='sidebar-profile-container'>
          <button type="button" onClick={() => { setUsersView(false); setIsExpanded(false) }} className='back-button'><FiArrowLeftCircle /></button>
          <input onChange={(e) => setSearchValue(e.target.value)} type='search' className='search-input' placeholder='Search Users' />
        </div>
        <div className={`container ${isExpanded ? 'expanded' : ''}`}>
          {searchUsersData.map(eachUser => (
            <button
              type="button"
              key={eachUser.id}
              onClick={() => { handleClickSelectUser(eachUser.id, eachUser); setIsExpanded(false) }}
              className={eachUser.id === message.receiverid ? 'sidebar-profil-container-active' : 'sidebar-profil-container-inactive'}
            >
              <p className='sidebar-profile-icon'>
                {eachUser.fullname.split(" ").length > 1 ? eachUser.fullname.split(" ")[0][0] + eachUser.fullname.split(" ")[1][0] : eachUser.fullname[0]}
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
          <button type="button" onClick={() => { setUsersView(true); setIsExpanded(true) }} style={{ marginTop: '0px' }} className='sidebar-profile-icon'><IoPersonAddOutline /></button>
        </div>
        <div className={`container ${isExpanded ? 'expanded' : ''}`}>
          {chatUsersData.map(eachUser => {
            return (
              <><button
                type="button"
                key={eachUser.id}
                onClick={() => { handleClickChattedUser(eachUser.id, eachUser); setIsExpanded(false) }}
                className={eachUser.id === message.receiverid ? 'sidebar-profil-container-active' : 'sidebar-profil-container-inactive'}
              >
                <p className="sidebar-profile-icon">
                  {eachUser.fullname.split(" ").length > 1 ? eachUser.fullname.split(" ")[0][0] + eachUser.fullname.split(" ")[1][0] : eachUser.fullname[0]}
                  {eachUser.loginstatus && <span className="status-dot"></span>}
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
          <button type="button" className='dashboard-button' onClick={onClickDeleteSelected}>
            <MdDelete className='dashboard-text-emoji-container-send' />
          </button>

          <button type="button" className='dashboard-button'>
            <IoIosShareAlt className='dashboard-text-emoji-container-send' />
          </button>
        </div>
      </div>)
  }

  const messageFeatures = (eachMessage) => {
    return (
      <div className='edit-bar-container' style={{ alignSelf: eachMessage.senderid === senderData.id ? 'flex-end' : 'flex-start' }}>
        {eachMessage.senderid === senderData.id && <button type="button" onClick={() => handleMessageEdit(eachMessage.id, eachMessage.message)} className='edit-bar-button'>Edit</button>}
        <button type="button" onClick={() => handleMessageSelect(eachMessage.id)} className='edit-bar-button'>Select</button>
        <button type="button" onClick={() => handleMessageDelete(eachMessage.id)} className='edit-bar-button'>Delete</button>
        <CopyToClipboard text={eachMessage.message}>
          <button type="button" onClick={() => alert('Text copied!')} className='edit-bar-button'>Copy</button>
        </CopyToClipboard>
      </div>
    )
  }

  const inputBarEditView = () => {
    return (
      <form onSubmit={handleEditMessageSend} className='dashboard-input-elements-container'>
        <input
          type='text'
          placeholder='Type your message...'
          value={editMessage.message}
          className='dashboard-input-text'
          onChange={(e) => setEditMessage({ ...editMessage, message: e.target.value })}
        />
        <button type="submit" className='dashboard-button'>
          <BsFillSendFill className='dashboard-text-emoji-container-send' />
        </button>
      </form>
    )
  }

  const inputBarMessageView = () => {
    return (
      <form onSubmit={handleClickSend} className='dashboard-input-elements-container'>
        <input
          type='text'
          placeholder='Type your message...'
          value={message.message}
          className='dashboard-input-text'
          onChange={(e) => setMessage({ ...message, message: e.target.value })}
        />
        <button type='submit' className='dashboard-button' >
          <BsFillSendFill className='dashboard-text-emoji-container-send' />
        </button>
      </form>
    )
  }





  const filteredMessages = chat.filter(
    message =>
      !(message.senderid === senderData.id && message.deleted_by_sender) &&
      !(message.receiverid === senderData.id && message.deleted_by_receiver)
  );

  return (
    <div className='dashboard-total-container'>
      {usersView ? allUsers() : chattedUsers()}
      <button className='swipe-button'> <h1 className='name-search'>{selectInput && <MdKeyboardBackspace onClick={() => setSelectInput(false)} className='back-arrow' />}{chattingUser.fullname ? chattingUser.fullname : chatUsersData.length >= 1 && chatUsersData[0].fullname}
        {chattingUser.fullname && chattingUser.loginstatus ? <span className='last-seen-online'> Online</span> : <span className='last-seen'> Last seen at {chattingUser.lastseen ? formatAMPM(new Date(chattingUser.lastseen)) : chatUsersData.length >= 1 && formatAMPM(new Date(chatUsersData[0].lastseen))}</span>}
      </h1>{isExpanded ? <FaCaretSquareUp onClick={toggleContainer} /> : <FaCaretSquareDown onClick={toggleContainer} />}</button>
      <div className='dashboard-chat-container'>
        <h1 className='name-search-1'> {selectInput && <MdKeyboardBackspace onClick={() => setSelectInput(false)} className='back-arrow' />}{chattingUser.fullname ? chattingUser.fullname : chatUsersData.length >= 1 && chatUsersData[0].fullname}
          {chattingUser.fullname && chattingUser.loginstatus ? <span className='last-seen-online'> Online</span> : <span className='last-seen'> Last seen at {chattingUser.lastseen ? formatAMPM(new Date(chattingUser.lastseen)) : chatUsersData.length >= 1 && formatAMPM(new Date(chatUsersData[0].lastseen))}</span>}
        </h1>
        <div className='chat-container'>
          <div className='dashboard-chat-box-container'>
            {filteredMessages.map((eachMessage, index) => {
              const timeStamp = new Date(eachMessage.timestamp);
              const time = formatAMPM(timeStamp);
              const isSender = eachMessage.senderid === senderData.id;
              const isImage = eachMessage.file && /\.(jpg|jpeg|png|gif)$/i.test(eachMessage.file);

              return (
                <>
                <div
                  key={index}
                  className="message-input-container"
                  style={{ alignSelf: isSender ? 'flex-end' : 'flex-start' }}
                >
                  {selectInput && (
                    <input
                      className="select-input"
                      id={eachMessage.id}
                      onChange={onSelectMessage}
                      type="checkbox"
                    />
                  )}
                  <p
                    className={isSender ? 'message-sender' : 'message-receiver'}
                    onMouseEnter={() => setViewEdit(eachMessage.id)}
                    onMouseLeave={() => setViewEdit(false)}
                  >
                    {isImage ? (
                      <div style={{display: "flex", flexDirection: "column"}}>
                      <img
                        src={`${showFileUrl}${eachMessage.file}`}
                        alt="Image message"
                        className="message-image"
                        onClick={() => window.open(`${showFileUrl}${eachMessage.file}`, '_blank')}
                      />
                      <span style={{marginTop: "5px"}} className="message-span">{eachMessage.message}</span>
                      </div>
                    ) : eachMessage.file ? (
                      <div className="file-container">
                        <button
                          style={{ color: isSender ? 'white' : 'black' }}
                          className="file-link"
                          onClick={() => window.open(`${showFileUrl}${eachMessage.file}`, '_blank')}
                        >
                          <span style={{ alignSelf: 'center' }}>
                            <FaFileAlt className="file-image-icon" />
                          </span>
                          <span className="file-name">{eachMessage.file}</span>
                        </button>
                        <span style={{marginTop: "5px"}} className="message-span">{eachMessage.message}</span>
                      </div>
                    ) : (
                      <span className="message-span">{eachMessage.message}</span>
                    )}
                    <div className="message-time-container">
                      {viewEdit === eachMessage.id ? (
                        <button
                          type="button"
                          onClick={() => setEditBarView(prev => (prev === eachMessage.id ? false : eachMessage.id))}
                          style={{ color: isSender ? 'white' : 'black' }}
                          className="message-feature-button"
                        >
                          <FaRegEdit />
                        </button>
                      ) : (
                        <p className="message-feature-empty-button"></p>
                      )}
                      <span className="time-span">
                        {time}
                        {isSender && (
                          eachMessage.read ? (
                            <IoCheckmarkDone className="double-tik-blue" />
                          ) : chattingUser.loginstatus ? (
                            <IoCheckmarkDone className="double-tik" />
                          ) : (
                            <IoCheckmarkOutline className="single-tik" />
                          )
                        )}
                      </span>
                    </div>
                  </p>
                </div>
                  {editBarView === eachMessage.id && messageFeatures(eachMessage)}
                  </>
              );
            })}

            <div ref={chatEndRef} />

          </div>
          {showEmojiPicker && <div className='emoji-input'><EmojiPicker className='emoji-input' onEmojiClick={onEmojiClick} /></div>}

        </div>
        <div className='dashboard-chat-main-container'>
          {selectInput ? inputBarSelectedFeaturesView() : isSelectMessageEdit ? inputBarEditView() : inputBarMessageView()}
          <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className='dashboard-text-emoji-button'>😀</button>
          <input type="file" id="fileUpload" onChange={handleFileChange} style={{ display: "none" }} />
          <label htmlFor="fileUpload" className='dashboard-file-button'>
            <GoFileMedia />
          </label>
          {selectedFile && (
            <div className='selected-image-container'>
              {previewUrl && (
                <img src={previewUrl} alt="Preview" className='selected-image' />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
