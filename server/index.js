const express = require("express")
const db = require("./connection.js")

app = express()

const PORT = 4000
app.listen(PORT, () => {
    console.log("server is running");
})

