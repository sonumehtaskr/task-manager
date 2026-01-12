const express = require("express");
const router = express.Router();

const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  deleteAllTask,
} = require("../controllers/task");

const { auth } = require("../middlewares/auth");

const { firebaseauth } = require("../firebasemiddleware/auth");

router.post("/createTask", firebaseauth, createTask);
router.get("/getAllTask", firebaseauth, getAllTasks);
router.put("/updateTask", firebaseauth, updateTask);
router.delete("/deleteTask", firebaseauth, deleteTask);
router.delete("/deleteAllTask", firebaseauth, deleteAllTask);

module.exports = router;
