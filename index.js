require('dotenv').config()

const express = require('express')
const cors = require('cors')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const sqlite3 = require('sqlite3').verbose()
const tasksRoute = require('./Routes/tasks')

const app = express()
const PORT = process.env.PORT

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Test Case API',
      version: '1.0.0',
    },
  },
  apis: ['index.js', './Routes/*.js'], // files containing annotations as above
};

let db = new sqlite3.Database(process.env.DATABASE_URL, sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
});

// Create table if not exists
let sql = `CREATE TABLE IF NOT EXISTS tasks(
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  dueDate INTEGER NOT NULL)`

db.run(sql)

const swaggerDocs = swaggerJsDoc(options)
// console.log(swaggerDocs)

app.use(express.json())
app.use(cors())
app.options("*", cors())
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

/**
 * @openapi
 * /:
 *   get:
 *     summary: Returns a static string
 *     description: Returns a static string
 *     responses:
 *       200:
 *         description: Returns a string.
 */

app.get("/", (req, res) => {
	res.send('Hello World')
})

app.use('/tasks', tasksRoute)

app.listen(PORT, () => console.log(`Listening on ${PORT}`))