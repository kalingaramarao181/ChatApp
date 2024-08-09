import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "../config";
import "./index.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const Signup = () => {
  const [data, setData] = useState({
    fullname: "",
    email: "",
    password: "",
    phoneno: "",
    dateofbirth: "",
    address: "",
  });
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [emailOtp, setEmailOtp] = useState(null)

  const handleChange = (element, index) => {
    const value = element.value;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Focus on the next input field if not the last one
      if (index < 5) {
        element.nextSibling.focus();
      }
    }
  };

  const handleKeyDown = (element, index) => {
    if (element.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index]) {
        // Clear the current input value
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Move focus to the previous input field if empty and clear that field too
        element.target.previousSibling.focus();
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };


  const { fullname, email, password, phoneno, dateofbirth, address } = data;

  const onCangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submithandler = (e) => {
    e.preventDefault();
    if (otp.join("") !== emailOtp.toString()) {
      alert("You Entered Wrong PIN")
    }
    else {
      axios.post(`${baseUrl}signup-user`, data)
        .then((res) => {
          alert("Successfully added user");
        })
        .catch((err) => {
          alert(err.message);
        });
      setData({ fullname: "", email: "", password: "", phoneno: "", dateofbirth: "", address: "", });
    }
  };

  const onClickOtpSend = () => {
    axios.post(`${baseUrl}send-otp`, data)
      .then(res => {
        setEmailOtp(res.data);
      })
      .catch(err => {
        console.log(err);

      })
  }

  return (
    <div className="sign-main-container">
      <div className="sign-form-full-container">
        <h1 className="sign-heading">Signup Form</h1>
        <form className="input-full-container" onSubmit={submithandler}>
          <label className="sign-paragraph">Full Name</label>
          <input type="text" className="sign-input-tag" name="fullname" value={fullname} onChange={onCangeHandler} placeholder="Enter Your FullName" required />
          <label className="sign-paragraph">Email</label>
          <input type="email" className="sign-input-tag" name="email" value={email} onChange={onCangeHandler} placeholder="Enter Your Email" required />
          <label className="sign-paragraph">Password</label>
          <input type="password" className="sign-input-tag" name="password" value={password} onChange={onCangeHandler} placeholder="Enter Your Password" required />
          <label className="sign-paragraph">Phone Number</label>
          <input type="number" className="sign-input-tag" name="phoneno" value={phoneno} onChange={onCangeHandler} placeholder="Enter Your Phone Number" required />
          <label className="sign-paragraph">Date Of Birth</label>
          <input type="date" className="sign-input-tag" name="dateofbirth" value={dateofbirth} onChange={onCangeHandler} required />
          <label className="sign-paragraph">Address</label>
          <textarea type="text" className="sign-input-tag" name="address" value={address} onChange={onCangeHandler} placeholder="Enter Your Address" required />
          {!emailOtp && <button type="button" onClick={onClickOtpSend} className="sign-input-tag-submit">Send OTP</button>}
          {emailOtp && <div className="otp-container">
            <div>
            {otp.map((value, index) => (
              <input
                key={index}
                type="text"
                name="otp"
                maxLength="1"
                value={value}
                onChange={e => handleChange(e.target, index)}
                onKeyDown={e => handleKeyDown(e, index)}
                className="otp-input"
              />
            ))}
            </div>
            <input type="submit" className="sign-input-tag-submit" />
          </div>}
          <Link to="/login" className="keep-login">Keep Login</Link>
        </form>
      </div>
      <div>
        <img src="images\8-2-web-security-png-hd.png" alt="signin-img" className="signin-image" />
      </div>
    </div>
  );
};

export default Signup;
