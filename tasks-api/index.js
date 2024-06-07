const express = require("express");
const fs = require("fs");
const tasks = require("./MOCK_DATA.json");

const app = express();
const port = process.env.PORT || 8001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);
  if (task) {
    res.json(task);
  } else {
    res.status(400).json({ status: "Task not found" });
  }
});

app.post("/tasks", (req, res) => {
  const body = req.body;
  if (!body || !body.Title || !body.description || !body.year) {
    return res.status(400).json({ msg: "All Field must required" });
  }
  const newTask = { ...body, id: tasks.length + 1 };
  tasks.push(newTask);
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(tasks), (err, data) => {
    if (err) {
      return res.status(500).json({ status: "Error writing file" });
    }
    return res.status(201).json({ status: "success", id: newTask.id });
  });
});

app.patch("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(400).json({ status: "Task not found" });
  }

  const { title, description } = req.body;

  if (title) task.title = title;
  if (description) task.description = description;

  fs.writeFile(
    "./MOCK_DATA.json",
    JSON.stringify(tasks, null, 2),
    (err, data) => {
      return res.json(task);
    }
  );
});

app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.json({ status: "Task not found" });
  }

  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ msg: "Title and description are required" });
  }

  task.title = title;
  task.description = description;

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(tasks, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ status: "Error writing file" });
    }
    return res.json(task);
  });
});

app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.json({ status: "Task not found" });
  }

  tasks.splice(taskIndex, 1);

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(tasks, null, 2), (err) => {
    return res.json({ status: "success" });
  });
});
