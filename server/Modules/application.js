const express = require('express');
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

// You can add other middlewares here

module.exports = app;
