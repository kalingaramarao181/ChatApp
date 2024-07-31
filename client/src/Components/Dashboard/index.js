import React, { useState } from 'react'
import { CgProfile } from "react-icons/cg";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { BsFillSendFill } from "react-icons/bs";
import './index.css'

const Dashboard = () => {

    const senderData = JSON.parse( localStorage.getItem("senderData") )

    const [message,setMessage]= useState({          
        senderid:senderData.id,       
        receiverid:0,
        message:""
    })
    const handelMessage=(e)=>{
          setMessage({...message,message:e.target.value})
    }
   
    const onClickSend =()=>{
        console.log(message);

    }


  return (
    <>
    <div className='dashboard-total-container'>
    <div className='dashboard-main-container'>
    <div className='dashboard-profil-container'>
    <CgProfile className='dashboard-profil-icon' />
        <h1 className='dashboard-profil-heading'>Raguvaran</h1>
    </div>
    <div className='dashboard-profil-container-2'>
    <CgProfile className='dashboard-profil-icon' />
        <h1 className='dashboard-profil-heading'>suresh</h1>
    </div>
    <div className='dashboard-profil-container-2'>
    <CgProfile className='dashboard-profil-icon' />
        <h1 className='dashboard-profil-heading'>ramarao</h1>
    </div> 
    <div className='dashboard-profil-container-2'>
    <CgProfile className='dashboard-profil-icon' />
        <h1 className='dashboard-profil-heading'>manoj</h1>
    </div>   
    <div className='dashboard-profil-container-2'>
    <CgProfile className='dashboard-profil-icon' />
        <h1 className='dashboard-profil-heading'>manoj</h1>
    </div>   <div className='dashboard-profil-container-2'>
    <CgProfile className='dashboard-profil-icon' />
        <h1 className='dashboard-profil-heading'>manoj</h1>
    </div>   <div className='dashboard-profil-container-2'>
    <CgProfile className='dashboard-profil-icon' />
        <h1 className='dashboard-profil-heading'>manoj</h1>
    </div>   <div className='dashboard-profil-container-2'>
    <CgProfile className='dashboard-profil-icon' />
        <h1 className='dashboard-profil-heading'>manoj</h1>
    </div>   <div className='dashboard-profil-container-2'>
    <CgProfile className='dashboard-profil-icon' />
        <h1 className='dashboard-profil-heading'>manoj</h1>
    </div>   
    </div>
    <div className='dashboard-chat-container'>
        <div className='dashboard-chat-main-container'>
            <div className='dashboard-input-elements-container'>
        <input type='text' placeholder='Message-Here' className='dashboard-input-text' onChange={handelMessage}/>
       <button className='dashboard-button' onClick={onClickSend} > <BsFillSendFill   className='dashboard-text-emoji-container-send'/> </button>
        </div>
        <MdOutlineEmojiEmotions className='dashboard-text-emoji-container' />
        </div>
    </div>
    </div>
    </>
  )
}

export default Dashboard