const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    const newTask = new Task({
      ...req.body,
      author: req.user.email,
    });
    try {
      await newTask.save();
      console.log("Task creation success");
      res.status(201).json({
        success: true,
        message: "Task creation success",
        data:newTask
      });
      return;
    } catch (error) {
      console.log("Task creation error", error);
      res.status(400).json({
        success: false,
        message: "Task creation error",
      });
      return;
    }
  } catch (error) {
    console.log("Error while creating task", error);
    res.status(400).json({
      success: false,
      message: "Error while creating task",
    });
    return;
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const email = req.user.email;
    const tasks = await Task.find({ author: email }).sort({ updatedAt: -1 });
    const completeTask = tasks.filter(task => task.completed).length;
    const incompleteTask = tasks.filter(task => !task.completed).length;
    res.status(201).json({
      success: true,
      message: "Fetched all tasks successfuly",
      data: tasks,
      completeTask,
      incompleteTask
    });
  } catch (error) {
    console.log("Error while fetching task", error);
    res.status(400).json({
      success: false,
      message: "Error while fetching task",
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const id = req.body.id.toString();
    const task = await Task.findById(id);
    if (!task) {
      console.log("task not found");
      res.status(400).json({
        success: false,
        message: "Task not found",
      });
      return;
    }
    if (task.author != req.user.email) {
      console.log("Unauthorized user");
      res.status(400).json({
        success: false,
        message: "Unauthorized user",
      });
      return;
    }

    task.title = req.body.title?req.body.title:task.title;
    task.desc = req.body.desc?req.body.desc:task.desc;
    req.body.status = Boolean(req.body.status);
    task.completed = req.body.status;
    await task.save();
    console.log("Task Update success");
    res.status(201).json({
      success: true,
      message: "Task Update success",
    });
  } catch (error) {
    console.log("Task Update error: ", error);
    res.status(500).json({
      success: false,
      message: "Task update error",
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    try {
      const id = req.body.id?.toString();
      const result = await Task.findOneAndDelete({
        _id: id,
        author: req.user.email,
      });
      if (!result) {
        console.log("Task not found or Invalid Id");
        res.status(401).json({
          success: false,
          message: "Task not found or Invalid Id",
        });
        return;
      }
    } catch (error) {
      console.log("Invalid task Id");
      res.status(401).json({
        success: false,
        message: "Invalid task Id",
      });
    }
    console.log("Task deletion success");
    res.status(201).json({
      success: true,
      message: "Task deletion success",
    });
  } catch (error) {
    console.log("Error while deleting the task: ");
    res.status(500).json({
      success: false,
      message: "Task deletion error",
    });
  }
};

exports.deleteAllTask = async (req, res) => {
  try {
    const email = req.user.email;
    const result = await Task.findOneAndDelete({
      author: email,
    });
    if (!result) {
      console.log("Task not found for user");
      res.status(400).json({
        success: false,
        message: "Task not found for user",
      });
      return;
    }
    console.log("all Task deletion success");
    res.status(201).json({
      success: true,
      message: "all Task deletion success",
    });
  } catch (error) {
    console.log("Error while deleting the task: ", error);
    res.status(500).json({
      success: false,
      message: "Task deletion error",
    });
  }
};
