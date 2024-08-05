import React from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";

const Navbar = () => {
  const token = Cookies.get("jwtToken");

  const onClickLogout =()=>{
    Cookies.remove('jwtToken')
    localStorage.removeItem("senderData")
    window.location.reload()
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
            <Link to="/" className="navbar-elements">                                                     
              <li>Home</li>
            </Link>
            {token ? (
              <Link to="/Login" className="navbar-elements">
                <button onClick={onClickLogout} className="login-button" > Logout</button>
              </Link>
            ) : (
              <Link to="/Login" className="navbar-elements">
                <button className="login-button" >Login</button> 
              </Link>
            )}
            <Link to="/Signin" className="navbar-elements">
              <li>Signin</li>
            </Link>
          </div>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
