const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        trim:true,
        required:true
    },email: {
        unique:true,
        lowercase:true,
        type:String,
        trim:true,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('please provide a valid email')
            }
        }
    },password: {
        type:String,
        minlength:7,
        maxlength:10,
        required:true,
        validate(value){
            if(!value.includes(value)){
                throw new Error('please contain a password') 
            }
        }
    },age:{
        type:Number,
        default:0,
        validate(value){
            if(value < 0){
                throw new Error('please contain a password')
            }
        }
    }
})


const User = mongoose.model('User', userSchema)
module.exports = User