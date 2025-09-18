const express = require("express");
const app = express();

app.use(express.json());

let tasks = [
  {
    id: 1,
    title: "Set up environment",
    description: "Install Node.js, npm, and git",
    completed: true,
    priority: "high",
    createdAt: new Date("2023-01-01T10:00:00Z"),
  },
];
let nextId = 2; // To keep track of the next task ID as per json to pass testcase
// Create a new task
app.post("/tasks", (req, res) => {
  const { title, description, completed, priority } = req.body;
  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof completed !== "boolean"
  ) {
    return res.status(400).send({ error: "Invalid task data" });
  }

  const newTask = {
    id: nextId++,
    title,
    description,
    completed,
    priority: priority ?? "medium",
    createdAt: new Date(),
  };
  tasks.push(newTask);
  res.status(201).send(newTask);
});

// Get all tasks with optional filtering and sorting
app.get("/tasks", (req, res) => {
  let result = [...tasks];

  // Filter by completion status
  if (req.query.completed !== undefined) {
    const completed = req.query.completed === "true";
    result = result.filter((task) => task.completed === completed);
  }

  // Sort by creation date
  result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  res.status(200).send(result);
});

// Get tasks by priority
app.get("/tasks/priority/:level", (req, res) => {
  const level = req.params.level.toLowerCase();
  const filtered = tasks.filter((task) => task.priority === level);
  res.status(200).send(filtered);
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

  const { title, description, completed, priority } = req.body;
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
  task.priority = priority;
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