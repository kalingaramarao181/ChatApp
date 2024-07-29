const mysql = require("mysql")
const db = mysql.createConnection({
    host: "localhsot",
    password: "",
    database: "chatapp",
    user: "root"
})

module.exports = db