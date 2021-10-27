const User = require('../models/user')
const jwt = require('jsonwebtoken')
const auth = async(req, res, next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        // console.log(token)
        const decoded = jwt.verify(token, 'thisismycode')
        // console.log(decoded)
        const user = await User.findOne({ _id:decoded._id, 'tokens.token':token })
        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    }catch{
        res.status(403).send({ error:'please authenticate' })
    }
}

module.exports = auth