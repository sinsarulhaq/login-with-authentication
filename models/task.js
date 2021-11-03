const mongoose = require('mongoose')
const User = require('../models/user')
const taskSchema = new mongoose.Schema({
    completed: {
        type: Boolean,
        default: false
    }, description: {
        type: String,
        trim: true,
        required: true
    },owner: {
        type: mongoose.Schema.Types.ObjectId,
        // ref:'User',
        required:true
    }
},{
    timestamps:true
})

const Task = mongoose.model('Task', taskSchema)
module.exports = Task