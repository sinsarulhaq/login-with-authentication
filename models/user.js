const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    }, email: {
        unique: true,
        lowercase: true,
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('please provide a valid email')
            }
        }
    }, password: {
        type: String,
        minlength: 7,
        maxlength: 68,
        required: true,
        validate(value) {
            if (!value.includes(value)) {
                throw new Error('please contain a password')
            }
        }
    }, age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('please contain a password')
            }
        }
    }, tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.tokens
    delete userObject.password

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismycode')

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.findByChecking = async (email, password) => {
    const user = await User.findOne({ email })
    if (!email) {
        throw new Error('Unable to Login!')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to Login!')
    }
    return user
}

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User