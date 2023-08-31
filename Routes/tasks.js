const express = require('express')
const router = express.Router()
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database(process.env.DATABASE_URL, sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
  console.log('Connected to the tasks SQlite database.');
});

const getAll = `SELECT * FROM tasks`
const getOneTask = `SELECT * FROM tasks where id = ?`
const insertTask = `INSERT INTO tasks(title,description,dueDate) VALUES (?,?,?)`
const deleteTask = `DELETE FROM tasks WHERE id = ?`
const updateTask = `UPDATE tasks SET title = ?, description = ?, dueDate = ? WHERE id = ?`

// Reading All
/**
 * @openapi
 * /tasks:
 *   get:
 *     description: Returns all tasks
 *     responses:
 *       200:
 *         description: Returns all tasks
 */
router.get("/", (req, res) => {
  db.all(getAll, (err, rows) => {
    if (err) {
      res.status(500).json({ "error": err.message })
      return
    }
    res.status(200).json({ rows })
  })
})

// Reading One
/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     summary: Retrieve a single task
 *     description: Retrieve a single task
 *     parameters:
 *     - in: path
 *       name: id
 *       description: ID of the task that is to be retrieved
 *     responses:
 *       200:
 *         description: Success.
 */
router.get("/:id", getTask, (req, res) => {
  res.json(res.task)
})

// Creating One
/**
 * @openapi
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     description: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Title of the task
 *               description:
 *                 type: string
 *                 example: Lorem ipsum dolor
 *               dueDate:
 *                 type: string
 *                 example: 2023-01-01 10:20:05.123
 *                 pattern: '^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$'
 *     responses:
 *       201:
 *         description: Success.
 */
router.post("/", (req, res) => {
  let params = Object.values(req.body)
  db.run(insertTask, params, function(err) {
    if (err) {
      res.status(400).json({ message: err.message })
      return
    }
    req.body = {id: this.lastID, ...req.body}
    res.status(201).json(req.body)
  })
})

// Updating One
/**
 * @openapi
 * /tasks/{id}:
 *   patch:
 *     description: Update a single task
 *     parameters:
 *     - in: path
 *       name: id
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Title of the task
 *               description:
 *                 type: string
 *                 example: Lorem ipsum dolor
 *               dueDate:
 *                 type: string
 *                 example: 2023-01-01 10:20:05.123
 *                 pattern: '^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$'
 *     responses:
 *       200:
 *         description: Success.
 */
router.patch("/:id", getTask, (req, res) => {
  if (req.body?.title) {
    res.task.title = req.body.title
  }
  if (req.body?.description) {
    res.task.description = req.body.description
  }
  if (isValidDatetime(req.body?.dueDate)) {
    res.task.dueDate = req.body.dueDate
  }
  
  let params = [...Object.values(res.task)]
  params.push(params.shift())
  db.run(updateTask, params, (err) => {
    if (err) {
      return res.status(400).json({message: err.message})
    }
    res.json(res.task)
  })
})

// Deleting One
/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a single task
 *     description: Delete a single task
 *     parameters:
 *     - in: path
 *       name: id
 *       description: ID of the task that is to be deleted
 *     responses:
 *       200:
 *         description: Success.
 */
router.delete("/:id", getTask, (req, res) => {
  let params = [req.params.id]
  db.run(deleteTask, params, (err) => {
    if (err) {
      return res.status(500).json({ message: err.message })
    }
    res.json({ message: "Deleted Task"})
  })
})


function getTask (req, res, next) {
  let params = [req.params.id]
  db.get(getOneTask, params, (err, row) => {
    if (err) {
      res.status(500).json({ "error": err.message })
      return
    }
    if (row == null) {
      return res.status(404).json({ message: "Cannot find task" })
    }
    res.task = row
    next()
  })
}

function isValidDatetime(input) {
  const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/
  
  if (!datetimeRegex.test(input)) {
    return false; // Format is not valid
  }
  return true
}
module.exports = router