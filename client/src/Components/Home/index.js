import React from 'react'
import './index.css'
import { GrNotes } from "react-icons/gr";
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
const Home = () => {
  return (
    <>
      <div className='Home-main-container'>
        <div className='home-main-card-container'>
          <h1 className='home-main-heading' > <span className='echo-span-tag'> ECHOCHAT </span> ULTIMATE <br />MESSAGING PLATFORM  </h1>
          <p className='home-manin-paragraph'> Welcome to EchoChat, your ultimate destination for seamless
            and secure conversations. Designed for both personal and professional use, EchoChat ensures your
            messages are always private and instantly delivered. Enjoy real-time chatting with friends, family,
            and colleagues through an intuitive and user-friendly
            interface. Experience the future of communication with EchoChat, where your voice echoes around the world.</p>
          <Link to="/login"><button className='home-main-button'>Login</button></Link>
        </div>
        <div className='signin-main-container-home'>
          <div className='home-signin-main-card-container'>
            <div className='home-signin-card-container'>
              <h1 className='home-signin-heading'>User Status and Activity Feed</h1>
              <div>
                <GrNotes className='signin-icon' />
              </div>
            </div>
            <p className='home-signin-paragraph'>The User Status and Activity Feed provides real-time updates on user activity and status. 
              It displays which users are online, who is currently active in chat rooms, and recent message exchanges. 
              This feature helps users stay informed about their contacts' availability and recent interactions. 
              By incorporating a visual status indicator or an activity log, users can quickly see who is available for a chat or view recent conversation highlights. 
              This can be especially useful for collaborative environments or when trying to catch up on missed messages.</p>
            <button className='home-signin-button'>Signin</button>
          </div>
          <div className='home-signin-main-card-container'>
            <div className='home-signin-card-container'>
              <h1 className='home-signin-heading'>Quick Access to Chat Rooms and Contacts</h1>
              <div>
                <GrNotes className='signin-icon'/>
              </div>
            </div>
            <p className='home-signin-paragraph'>Quick Access to Chat Rooms and Contacts allows users to efficiently navigate to their most frequently used conversations and chat rooms. 
              It typically includes a list of favorite or recent chats, a search bar for finding specific contacts or rooms, and options to create new chats or rooms directly from the home page. 
              Users can swiftly continue ongoing discussions or initiate new ones without navigating through multiple menus.</p>
            <button className='home-signin-button'>Signin</button>
          </div>
          <div className='home-signin-main-card-container'>
            <div className='home-signin-card-container'>
              <h1 className='home-signin-heading'>User Profile and Settings</h1>
              <div>
                <GrNotes className='signin-icon' />
              </div>
            </div>
            <p className='home-signin-paragraph'>The User Profile and Settings section gives users control over their personal information and application preferences. 
              It includes an overview of the user's profile, such as their picture, username, and status message, as well as options to edit this information. 
              Additionally, users can access and adjust various settings like notification preferences, privacy options, and theme choices. 
              This feature enhances user satisfaction by allowing customization and providing easy access to important settings. 
              It helps users manage their experience and ensure their profile is up-to-date.</p>
              <Link to="/signup"><button className='home-signin-button'>Signin</button></Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home