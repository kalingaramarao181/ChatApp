import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "../config";
import Cookies from "js-cookie";

const Login = () => {
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
      })
      .catch((err) => {
        // Improved error handling
        console.error('Login Error:', err.response ? err.response.data : err.message);
        alert(err.response ? err.response.data.error : err.message);
      });
  };

  return (
    <>
      <div className="sign-main-container">
        <div className="sign-form-full-container">
          <h1 className="sign-heading">Login Form</h1>
          <form onSubmit={submitHandler}>
            <div className="input-full-container">
              <label className="sign-paragraph">Email</label>
              <input
                type="email"
                className="sign-input-tag"
                name="email"
                value={email}
                onChange={onChangeHandler}
                required
              />
              <label className="sign-paragraph">Password</label>
              <input
                type="password"
                className="sign-input-tag"
                name="password"
                value={password}
                onChange={onChangeHandler}
                required
              />
              <input type="submit" className="sign-input-tag-submit" />
            </div>
          </form>
        </div>
        <div>
          <img
            src="images/slide-2.png"
            alt="signin-img"
            className="signin-image"
          />
        </div>
      </div>
    </>
  );
};

export default Login;
