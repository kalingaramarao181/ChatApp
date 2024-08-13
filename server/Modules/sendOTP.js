const express = require('express');
const router = express.Router();
const db = require('./connection');
const nodemailer = require('nodemailer');

const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
}

//SEND OTP FOR SIGNUP USER
router.post('/send-otp', (req, res) => {
  const { email, fullname } = req.body;
  const otp = generateOtp()
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // or 587 for TLS
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'bdtemployeestatus@gmail.com',
      pass: 'pmjwjulscjvelncd'
    }
  });

  const options = {
    from: 'bdtemployeestatus@gmail.com',
    to: email,
    subject: "OTP From ECHO-CHAT",
    text: "EchoChat verification OTP",
    html: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
        
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
        
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
        
            .logo {
              max-width: 100%;
              height: auto;
            }
        
            .content {
              text-align: justify;
              margin-bottom: 20px;
            }
        
            .button {
              display: inline-block;
              padding: 10px 20px;
              text-decoration: none;
              background-color: #3498db;
              color: #ffffff;
              border-radius: 3px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img class="logo" src="https://beedatatech.com/01_Important_Documents/Echo-Chat.png" alt="Company Logo">
              <h1>ECHO CHAT</h1>
            </div>
            <div class="content">
              <p>
                Hello ${fullname},
              </p>
              <p>
                ${otp} is your EchoChat verification OTP. Please do not share it with anyone.<br/>
              </p>
            </div>
          </div>
        </body>
        </html>`
  };

  transporter.sendMail(options, function (err, success) {
    if (err) {
      res.json(err);
    } else {
      res.json(otp)
    }
  });
});


//SEND OTP FOR UPDATE PASSWORD
router.post('/send-otp-password-change', (req, res) => {
  const { email } = req.body;
  const otp = generateOtp()
  const sql = "SELECT * FROM userdata WHERE email = ?"
  db.query(sql, [email], (err, data) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: 'No user found' });
    }
    else {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465, // or 587 for TLS
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'bdtemployeestatus@gmail.com',
          pass: 'pmjwjulscjvelncd'
        }
      });

      const options = {
        from: 'bdtemployeestatus@gmail.com',
        to: email,
        subject: "OTP From ECHO-CHAT",
        text: "EchoChat verification OTP",
        html:`<!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Email Template</title>
                  <style>
                    body {
                      font-family: 'Arial', sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                    }
                    .container {
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 20px;
                      background-color: #ffffff;
                      border-radius: 5px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                      text-align: center;
                      margin-bottom: 20px;
                    }
                    .logo {
                      max-width: 100%;
                      height: auto;
                    }
                    .content {
                      text-align: justify;
                      margin-bottom: 20px;
                    }
                    .button {
                      display: inline-block;
                      padding: 10px 20px;
                      text-decoration: none;
                      background-color: #3498db;
                      color: #ffffff;
                      border-radius: 3px;
                      font-weight: bold;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <img class="logo" src="https://beedatatech.com/01_Important_Documents/Echo-Chat.png" alt="Company Logo">
                      <h1>ECHO CHAT</h1>
                    </div>
                    <div class="content">
                      <p>Hello ${data[0].fullname},</p>
                      <p>${otp} is your EchoChat verification OTP. Please do not share it with anyone.<br/></p>
                    </div>
                  </div>
                </body>
                </html>`
      };

      transporter.sendMail(options, function (err, success) {
        if (err) {
          res.json(err);
        } else {
          res.json(otp)
        }
      });
    }
  })
});

module.exports = router