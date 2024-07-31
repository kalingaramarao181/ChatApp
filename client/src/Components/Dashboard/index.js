import React from 'react'
import { CgProfile } from "react-icons/cg";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { BsFillSendFill } from "react-icons/bs";
import './index.css'

const Dashboard = () => {
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
        <input type='text' className='dashboard-input-text'  />
        <BsFillSendFill   className='dashboard-text-emoji-container-send'/>
        </div>
        <MdOutlineEmojiEmotions className='dashboard-text-emoji-container' />
        </div>
    </div>
    </div>
    </>
  )
}

export default Dashboard