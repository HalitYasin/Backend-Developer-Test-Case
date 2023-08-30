const express = require('express')
const router = express.Router()
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database(process.env.DATABASE_URL, sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
    console.log('Connected to the tasks SQlite database.');
});

let sql

// Reading All
router.get("/", (req, res) => {
    sql = `SELECT * FROM tasks`
    db.all(sql, (err, rows) => {
        if (err) console.log(err);
        console.log(rows);
    })
})
// Reading One
// Creating One
// Updating One
// Deleting One


module.exports = router