import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "../config";
import Cookies from "js-cookie";
import './index.css'

const Login = (props) => {

  const { history } = props;

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = data;

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .post(`${baseUrl}login`, data)  // Sending data directly instead of {data}
      .then((res) => {
        console.log(res.data.message);
        Cookies.set("jwtToken", res.data.token, { expires: 30 });
        localStorage.setItem('senderData', JSON.stringify(res.data.user))
        history.replace('/chat')
        window.location.reload()
      })
      .catch((err) => {
        // Improved error handling
        console.error('Login Error:', err.response ? err.response.data : err.message);
        alert(err.response ? err.response.data.error : err.message);
      });
  };


  return (
    <>
      <div className="login-main-container">
        <div className="login-form-full-container">
          <h1 className="login-heading">Login Form</h1>
          <form className="input-full-container" onSubmit={submitHandler}>
              <label className="login-paragraph">Email</label>
              <input type="email" className="login-input-tag" name="email" value={email} onChange={onChangeHandler} placeholder="Enter Your Email" required />
              <label className="login-paragraph">Password</label>
              <input type="password" className="login-input-tag" name="password" value={password} onChange={onChangeHandler} placeholder="Enter Your Password" required/>
              <input type="submit" className="login-input-tag-submit" />
              <p className="keep-login"><a href="/signup">Register</a> If not User</p>
          </form>
        </div>
        <div>
          <img
            src="images\Cyber-Security.png"
            alt="signin-img"
            className="login-image"
          />
        </div>
      </div>
    </>
  );
};

export default Login;
