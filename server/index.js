const app = require('./Modules/application');
const userRoutes = require('./Modules/users');
const loginRoutes = require('./Modules/login');  // Import the login routes

app.use('/api', userRoutes);
app.use('/api', loginRoutes);  // Use the login routes
app.use('/api', chatRoutes);  // Use the login routes

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
