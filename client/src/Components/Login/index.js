import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "../config";
import Cookies from "js-cookie";
import './index.css'
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const Login = (props) => {
  const [passwodUpdatedView, setPaswordUpedatedView] = useState(false)
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [emailOtp, setEmailOtp] = useState(null)
  const [isShowPassword, setIsShowPassword] = useState(false)

  const { history } = props;

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = data;

  const onClickOtpSend = () => {
    axios.post(`${baseUrl}send-otp-password-change`, {email})
      .then(res => {
        setEmailOtp(res.data);
      })
      .catch(err => {
        console.error('Error:', err.response ? err.response.data : err.message);
        alert(err.response ? err.response.data.error : err.message);
      })
  }

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

  const handleChangePassword = () => {
      axios.put(`${baseUrl}update-password`, data)
      .then(res => {
        alert("Password Changed Successfully")
        window.location.reload()
      })
      .catch((err) => {
        console.log('Error update password:', err.response ? err.response.data : err.message);
        alert(err.response ? err.response.data : err.message)
      })
  }

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

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleVerifyButton = () => {
    if (emailOtp.toString() === otp.join("")){
      setIsShowPassword(true)
    }else{
      alert("You Entered Wrong PIN")
    }
  }

  const submitHandler = (e) => {
    e.preventDefault();
    axios.post(`${baseUrl}login`, data)  // Sending data directly instead of {data}
      .then((res) => {
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

  const otpVerification = () => {
    return (
      <div className="otp-container">
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
        <button type="button" onClick={handleVerifyButton} className="sign-input-tag-submit">Verify</button>
      </div>
    )
  }

  const forgetPasswordView = () => {
    return (
      <div className="login-form-full-container">
        <h1 className="login-heading">Login Form</h1>
        <form className="input-full-container" onSubmit={submitHandler}>
          {!isShowPassword ? <div className="input-full-container">
          <label className="login-paragraph">Email</label>
          <input type="email" className="login-input-tag" name="email" value={email} onChange={onChangeHandler} placeholder="Enter Your Email" required />
          {!emailOtp && <button type="button" onClick={onClickOtpSend} className="login-input-tag-submit">Send OTP</button>}
          {emailOtp && otpVerification()}
          </div>
          :<div className="input-full-container">
          <label className="login-paragraph">New Password</label>
          <input type="password" className="login-input-tag" name="password" value={password} onChange={onChangeHandler} placeholder="Enter Your new Password" required />
          <button type="button" onClick={handleChangePassword} className="login-input-tag-submit">Change Password</button>
          </div>}
        </form>
      </div>)
  }


  return (
    <div className="login-main-container">
      {passwodUpdatedView ? forgetPasswordView() :
        <div className="login-form-full-container">
          <h1 className="login-heading">Login Form</h1>
          <form className="input-full-container" onSubmit={submitHandler}>
            <label className="login-paragraph">Email</label>
            <input type="email" className="login-input-tag" name="email" value={email} onChange={onChangeHandler} placeholder="Enter Your Email" required />
            <label className="login-paragraph">Password</label>
            <input type="password" className="login-input-tag" name="password" value={password} onChange={onChangeHandler} placeholder="Enter Your Password" required />
            <input type="submit" className="login-input-tag-submit" />
            <p className="keep-login"><span onClick={() => setPaswordUpedatedView(true)} className="forget-password">Forget Password</span> Or <Link to="/signup">Register</Link> If not User</p>
          </form>
        </div>}
      <div>
        <img
          src="images\Cyber-Security.png"
          alt="signin-img"
          className="login-image"
        />
      </div>
    </div>
  );
};

export default Login;
