const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    completed: {
        type: Boolean,
        default: false
    }, description: {
        type: String,
        trim: true,
        required: true
    }
})

const Task = mongoose.model('Task', taskSchema)
module.exports = Task