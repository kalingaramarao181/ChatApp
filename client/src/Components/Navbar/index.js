import React from "react";
import { Link, useLocation  } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";
import axios from "axios";
import { baseUrl } from "../config";

const Navbar = () => {
  const location = useLocation();
  const inChatLocation = location.pathname === "/chat"
  const token = Cookies.get("jwtToken");
  const senderId = localStorage.getItem("senderData") && JSON.parse(localStorage.getItem("senderData")).id
  const isAdmin = localStorage.getItem("senderData") && JSON.parse(localStorage.getItem("senderData")).isadmin

  const onClickLogout =()=>{
    Cookies.remove('jwtToken')
    localStorage.removeItem("senderData")
    axios.put(`${baseUrl}update-logout/${senderId}`)
    .then(res => {
      console.log(res.data);
      window.location.reload()
    })
    .catch(err => {
      console.log(err);
      
    })
  }


  return (
    <>
      <div>
        <ul className="Navbar-container">
          <Link to="/" className="navbar-elements">
            <li>
              <img src="images\image.png" alt="logo" className="logo-image" />{""}
            </li>
          </Link>
          <div className="navbar-list-container">
          {(inChatLocation && isAdmin === 1) && 
          <Link to="/admin" className="navbar-elements">
            <button className="login-button">Dashboard</button>
          </Link>}                                                                 
            {!token ? (
              <Link to="/Login" className="navbar-elements">
                <button className="login-button" >Login</button> 
              </Link>
            ) : inChatLocation ? (
              <Link to="/Login" className="navbar-elements">
                <button onClick={onClickLogout} className="login-button" > Logout</button>
              </Link>
            ) : <Link to="/chat" className="navbar-elements">
            <button className="login-button" > Chat</button>
          </Link>}
          
          </div>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
