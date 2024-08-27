const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json());
app.use(cors());

// Import routes
const userRoutes = require('./Modules/users');
const loginRoutes = require('./Modules/login');
const otpRoutes = require('./Modules/sendOTP');
const chatRoutes = require('./Modules/chat');

// Use routes
app.use('/api', userRoutes);
app.use('/api', loginRoutes);
app.use('/api', chatRoutes);
app.use('/api', otpRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
