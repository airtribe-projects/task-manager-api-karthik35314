const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, (err) => {
  if (err) {
    return console.log("Something bad happened", err);
  }
  console.log(`Server is listening on ${port}`);
});

let tasks = [
  {
    id: 1,
    title: "Set up environment",
    description: "Install Node.js, npm, and git",
    completed: true,
  },
];
let nextId = 2; // this is to match edit testcase pass as per json given

// Create a new task
app.post("/tasks", (req, res) => {
  const { title, description, completed } = req.body;
  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof completed !== "boolean"
  ) {
    return res.status(400).send({ error: "Invalid task data" });
  }

  const newTask = { id: nextId++, title, description, completed };
  tasks.push(newTask);
  res.status(201).send(newTask);
});

// Get all tasks
app.get("/tasks", (req, res) => {
  res.status(200).send(tasks);
});

// Get a task by ID
app.get("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).send({ error: "Task not found" });
  res.status(200).send(task);
});

// Update a task by ID
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).send({ error: "Task not found" });

  const { title, description, completed } = req.body;
  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof completed !== "boolean"
  ) {
    return res.status(400).send({ error: "Invalid task data" });
  }

  task.title = title;
  task.description = description;
  task.completed = completed;
  res.status(200).send(task);
});

// Delete a task by ID
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).send({ error: "Task not found" });

  tasks.splice(index, 1);
  res.status(200).send({ message: "Task deleted" });
});

module.exports = app;
