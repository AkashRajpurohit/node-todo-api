const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TaskSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  task_name: {
    type: String,
    required: true
  },
  task_deadline: {
    type: String
  },
  active_status: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = Task = mongoose.model('tasks', TaskSchema)