const express = require("express");
const router = express.Router();

// Load models
const User = require("../../models/User");
const Task = require("../../models/Task");

// Error response
const errorResponse = require("../../utils/errorResponse");
// Success response
const successResponse = require("../../utils/successResponse");

// Constants
const constants = require("../../utils/constants");

// Protect routes
const ensureAuthenticated = require("../../utils/ensureAuthenticated");

// Task validator
const taskValidator = require("../../utils/validations/taskValidator");

// @route   GET /api/tasks
// @desc    get all tasks for the user
// @access  Protected
router.get("/", ensureAuthenticated, async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findOne({ _id: userId });
    // check if user exists
    if (!user) {
      return res.status(401).json(errorResponse(constants.UNAUTHORIZED));
    }
    // find all tasks for this user which are not soft deleted
    const tasks = await Task.find({ user_id: userId, active_status: true });

    // Check if we have tasks for the user
    if (tasks.length === 0) {
      return res.json(successResponse(constants.TASK_NOT_FOUND));
    }

    // return all tasks
    res.json(successResponse(constants.BASIC_MESSAGE, tasks));
  } catch (e) {
    console.log(e);
    res.status(500).json(errorResponse(constants.UNKNOWN_ERROR));
  }
});

// @route   GET /api/tasks/:id
// @desc    get all tasks for the user
// @access  Protected
router.get("/:id", ensureAuthenticated, async (req, res) => {
  const userId = req.userId;
  const taskId = req.params.id;
  try {
    const user = await User.findOne({ _id: userId });
    // check if user exists
    if (!user) {
      return res.status(401).json(errorResponse(constants.UNAUTHORIZED));
    }
    // find all tasks for this user which are not soft deleted
    const tasks = await Task.findOne({
      user_id: userId,
      _id: taskId,
      active_status: true
    });

    // Check if we have tasks for the user
    if (!tasks) {
      return res.json(successResponse(constants.TASK_NOT_FOUND));
    }

    // return all tasks
    res.json(successResponse(constants.BASIC_MESSAGE, tasks));
  } catch (e) {
    console.log(e);
    res.status(500).json(errorResponse(constants.UNKNOWN_ERROR));
  }
});

// @route   Post /api/tasks
// @desc    insert task
// @access  Protected
router.post("/", ensureAuthenticated, async (req, res) => {
  // check for validation errors
  const { errors, isValid } = taskValidator(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json(errorResponse(constants.VALIDATION_ERROR, errors));
  }
  // validations cleared
  const userId = req.userId;
  const { task_name, _id } = req.body;
  try {
    const user = await User.findOne({ _id: userId });
    // check if user exists
    if (!user) {
      return res.json(errorResponse(constants.UNAUTHORIZED));
    }
    if (_id) {
      const task = await Task.findById(_id);
      // Update task
      task.task_name = task_name;
      task.updatedAt = new Date();

      // Save it
      const saved = await task.save();

      if (saved) {
        res.json(successResponse(constants.BASIC_MESSAGE, saved));
      } else {
        res.json(errorResponse(constants.UNKNOWN_ERROR));
      }
    } else {
      // create new task
      const newTask = new Task({
        user_id: user.id,
        task_name
      });

      // save it
      const saved = await newTask.save();

      if (saved) {
        res.json(successResponse(constants.BASIC_MESSAGE, saved));
      } else {
        res.json(errorResponse(constants.UNKNOWN_ERROR));
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(errorResponse(constants.UNKNOWN_ERROR));
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Soft delete the task
// @access  Protected
router.delete("/:id", ensureAuthenticated, async (req, res) => {
  const userId = req.userId;
  const taskId = req.params.id;
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(401).json(errorResponse(constants.UNAUTHORIZED));
    }
    // Get the task
    const task = await Task.findById(taskId);

    // Check if task exists
    if (!task) {
      return res.status(404).json(errorResponse(constants.TASK_NOT_FOUND));
    }

    // Update task
    task.active_status = false;
    task.updatedAt = new Date();

    // Save it
    const saved = await task.save();

    if (saved) {
      res.json(successResponse(constants.BASIC_MESSAGE, saved));
    } else {
      res.json(errorResponse(constants.UNKNOWN_ERROR));
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(errorResponse(constants.UNKNOWN_ERROR));
  }
});

// -------------------------------------------------------------------------------
// Collab api's

// @route   POST /api/tasks/collab/:email
// @desc    Send tasks to other user via email
// @access  Protected
router.post("/collab/:email", ensureAuthenticated, async (req, res) => {
  const sendTaskToEmail = req.params.email;
  const { tasks } = req.body;

  try {
    // Get the user to whom the task(s) are to be shared
    const user = await User.findOne({ email: sendTaskToEmail });

    // check if user exists
    if (!user) {
      return res.json(errorResponse(constants.USER_NOT_EXISTS));
    }

    // Add the new tasks for this user
    for (let i = 0; i < tasks.length; i++) {
      // create new task
      let newTask = new Task({
        user_id: user.id,
        task_name: tasks[i]
      });

      // save it
      await newTask.save();
    }

    res.json(successResponse(constants.BASIC_MESSAGE));
  } catch (e) {
    console.log(e);
    res.status(500).json(errorResponse(constants.UNKNOWN_ERROR));
  }
});

module.exports = router;
