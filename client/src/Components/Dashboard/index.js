import React, { useState, useEffect } from 'react'
import { CgProfile } from "react-icons/cg";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { BsFillSendFill } from "react-icons/bs";
import './index.css'
import axios from 'axios';
import { baseUrl } from '../config';

const Dashboard = () => {
    const senderData = JSON.parse(localStorage.getItem("senderData"))

    const [message, setMessage] = useState({
        senderid: senderData.id,
        receiverid: 0,
        message: ""
    })
    const [chatUsersData, setChatUsersData] = useState([])
    const [chat, setChat] = useState([])
    const [chattingUser, setChattingUser] = useState({})


    useEffect(() => {
        axios.get(`${baseUrl}chatted-users/${senderData.id}`)
            .then((res) => {
                setChatUsersData(res.data)
                setMessage({ ...message, receiverid: res.data[0].id })
            }).catch(err => {
                console.log(err);
            })
    }, [ senderData.id])

    useEffect(() => {
        axios.get(`${baseUrl}messages/${message.senderid}/${message.receiverid}`)
            .then((res) => {
                setChat(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.log('Error fetching messages:', err);
            });
    }, [message.senderid, message.receiverid]);

    const handelMessage = (e) => {
        setMessage({ ...message, message: e.target.value })
    }

    const onClickSend = () => {
        console.log(message);
        axios.post(`${baseUrl}send-message`, { ...message })
            .then((res) => {
                console.log(res.data);
            })
            .catch(err => {
                console.log('Login Error:', err.response ? err.response.data : err.message);
            })

    }

    const onClickSendUser = (id, user) => {
        setMessage({ ...message, receiverid: id })
        setChattingUser(user)
    }


    return (
        <>
            <div className='dashboard-total-container'>
                <div className='dashboard-main-container'>
                    <div className='dashboard-profil-container'>
                        <CgProfile className='dashboard-profil-icon' />
                        <h1 className='dashboard-profil-heading'>{senderData.fullname}</h1>
                    </div>

                    {chatUsersData.map(eachUser => {
                        return (
                            <button onClick={() => onClickSendUser(eachUser.id, eachUser)} className={eachUser.id === message.receiverid ? 'dashboard-profil-container-3' : 'dashboard-profil-container-2'}>
                                <p className='dashboard-profil-icon'>{eachUser.fullname.split(" ")[0][0] + eachUser.fullname.split(" ")[1][0]}</p>
                                <h1 className='dashboard-profil-heading'>{eachUser.fullname}</h1>
                            </button>
                        )
                    })}
                </div>
                <div className='dashboard-chat-container'>
                    <div>
                        <h1>{chattingUser.fullname}</h1>
                    </div>
                    <div className='dashboard-chat-box-container'>
                        {chat.map(eachMessage => {
                            return <p style={{ alignSelf: eachMessage.senderid === senderData.id ? 'flex-end' : 'flex-start' }}>{eachMessage.message}</p>
                        })}
                    </div>
                    <div className='dashboard-chat-main-container'>
                        <div className='dashboard-input-elements-container'>
                            <input type='text' placeholder='Message-Here' className='dashboard-input-text' onChange={handelMessage} />
                            <button className='dashboard-button' onClick={onClickSend} > <BsFillSendFill className='dashboard-text-emoji-container-send' /> </button>
                        </div>
                        <MdOutlineEmojiEmotions className='dashboard-text-emoji-container' />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard