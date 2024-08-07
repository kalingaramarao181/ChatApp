import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "../config";
import "./index.css";

const Signup = () => {
  const [data, setData] = useState({
    fullname: "",
    email: "",
    password: "",
    phoneno: "",
    dateofbirth: "",
    address: "",
  });

  const { fullname, email, password, phoneno, dateofbirth, address } = data;

  const onCangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submithandler = (e) => {
    e.preventDefault();
    axios.post(`${baseUrl}signup-user`,data )
    .then((res) => {
      alert("Successfully added user");
    })
    .catch((err) => {
      alert(err.message);
    });
    setData({fullname: "", email: "", password: "", phoneno: "", dateofbirth: "", address: "",
  });
    
  };

  return (
      <div className="sign-main-container">
        <div className="sign-form-full-container">
          <h1 className="sign-heading">Signin Form</h1>
          <form  className="input-full-container" onSubmit={submithandler}>
              <label className="sign-paragraph">Full Name</label>
              <input type="text" className="sign-input-tag" name="fullname" value={fullname} onChange={onCangeHandler} placeholder="Enter Your FullName" required/>
              <label className="sign-paragraph">Email</label>
              <input type="email" className="sign-input-tag" name="email" value={email} onChange={onCangeHandler} placeholder="Enter Your Email" required/>
              <label className="sign-paragraph">Password</label>
              <input type="password" className="sign-input-tag" name="password" value={password} onChange={onCangeHandler} placeholder="Enter Your Password" required/>
              <label className="sign-paragraph">Phone Number</label>
              <input type="number" className="sign-input-tag" name="phoneno" value={phoneno} onChange={onCangeHandler} placeholder="Enter Your Phone Number" required />
              <label className="sign-paragraph">Date Of Birth</label>
              <input type="date" className="sign-input-tag" name="dateofbirth" value={dateofbirth} onChange={onCangeHandler} required/>
              <label className="sign-paragraph">Address</label>
              <textarea type="text" className="sign-input-tag" name="address" value={address} onChange={onCangeHandler} placeholder="Enter Your Address" required/>
              <input type="submit" className="sign-input-tag-submit" />
              <a href="/login"className="keep-login">Keep Login</a>
          </form>
        </div>
        <div>
          <img src="images\8-2-web-security-png-hd.png" alt="signin-img" className="signin-image"/>
        </div>
      </div>
  );
};

export default Signup;
