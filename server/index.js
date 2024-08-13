const app = require('./Modules/application');
const userRoutes = require('./Modules/users');
const loginRoutes = require('./Modules/login');
const otpRoutes = require('./Modules/sendOTP');  // Import the login routes
const bodyParser = require('body-parser');
const cors = require("cors");
const chatRoutes = require("./Modules/chat")

app.use(bodyParser.json());
app.use(cors());
app.use('/api', userRoutes);
app.use('/api', loginRoutes);
app.use('/api', chatRoutes);  
app.use("/api", otpRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
