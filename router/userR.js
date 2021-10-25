const express = require('express')
const User = require('../models/user')
const router = new express.Router()


//routers
router.post('/users',async(req, res)=>{
    try{
        const user = await User(req.body)
        await user.save()
        res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login',async(req, res)=>{
    try{
        const user = await User.findByChecking(req.body.email,req.body.password)
        res.status(200).send(user)
    }catch(e){
        res.status(404).send(e)
    }
})

router.get('/users/:id', async(req, res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user){
           return res.status(404).send()
        }
        res.status(201).send(user) 
    }catch(e){
        res.status(404).send(e)
    }
})

router.patch('/users/update/:id', async(req, res)=>{
    try{
        const user = await User.findByIdAndUpdate(req.params.id,req.body)
        if(!user){
           return res.status(404).send()
        }
         res.status(201).send(user)
    }catch(e){
        res.status(404).send(user)
    }
})

router.delete('/users/delete/:id', async(req, res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
           return res.status(404).send()
        }
        res.status(201).send(user)
    }catch(e){
        res.status(404).send(e)
    }
})


module.exports = router