import React from 'react'
import './index.css'
import { GrNotes } from "react-icons/gr";
const Home = () => {
  return (
   <>
   <div className='Home-main-container'>
    <div className='home-main-card-container'>
    <h1 className='home-main-heading' > <span className='echo-span-tag'> ECHOCHAT </span> ULTIMATE <br/>MESSAGING PLATFORM  </h1>
     <p className='home-manin-paragraph'> Welcome to EchoChat, your ultimate destination for seamless
       and secure conversations. Designed for both personal and professional use, EchoChat ensures your
        messages are always private and instantly delivered. Enjoy real-time chatting with friends, family,
         and colleagues through an intuitive and user-friendly
       interface. Experience the future of communication with EchoChat, where your voice echoes around the world.</p>
       <button className='home-main-button'>Login</button>
    </div>
<div className='signin-main-container-home'>
<div className='home-signin-main-card-container'>
  <div className='home-signin-card-container'>
  <h1 className='home-signin-heading'>Signin</h1>
  <div>
  <GrNotes className='signin-icon'/>
  </div>
  </div>
    <p className='home-signin-paragraph'>Sign in with your details and register on our 
      EchoChat website today. Experience seamless and secure communication with friends and family. Enjoy user-friendly
       features designed to enhance your chatting experience.
        Join our growing community and start chatting now!</p>
        <button className='home-signin-button'>Signin</button>
   </div>
   <div className='home-signin-main-card-container'>
  <div className='home-signin-card-container'>
  <h1 className='home-signin-heading'>Signin</h1>
  <div>
  <GrNotes className='signin-icon'/>
  </div>
  </div>
    <p className='home-signin-paragraph'>Sign in with your details and register on our 
      EchoChat website today. Experience seamless and secure communication with friends and family. Enjoy user-friendly
       features designed to enhance your chatting experience.
        Join our growing community and start chatting now!</p>
        <button className='home-signin-button'>Signin</button>
   </div>
   <div className='home-signin-main-card-container'>
  <div className='home-signin-card-container'>
  <h1 className='home-signin-heading'>Signin</h1>
  <div>
  <GrNotes className='signin-icon'/>
  </div>
  </div>
    <p className='home-signin-paragraph'>Sign in with your details and register on our 
      EchoChat website today. Experience seamless and secure communication with friends and family. Enjoy user-friendly
       features designed to enhance your chatting experience.
        Join our growing community and start chatting now!</p>
        <button className='home-signin-button'>Signin</button>
   </div>
</div>

   </div>
   </>
  )
}

export default Home