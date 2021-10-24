const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        
    },email: {
        
    },password: {
       
    }
})


const User = mongoose.model('User', userSchema)
module.exports = User