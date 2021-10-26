const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

router.post('/tasks', async(req, res)=>{
    const task = await Task(req.body)
    try{
        await task.save()
        res.send(task)
    }catch(e){
        res.status(404).send(e)
    }
})

router.get('/tasks/:id', async(req, res)=>{
    try{
        const task = await Task.findById(req.params.id)
        if(!task){
            res.status(404).send()
        }
        res.status(201).send(task)
    }catch(e){
        res.status(404).send()
    }
})

router.get('/tasks', async(req, res)=>{
    try{
        const task = await Task .find({})
        res.status(201).send(task)
    }catch(e){
        res.status(404).send(e)
    }
})

router.patch('/tasks/:id', async(req, res)=>{
    const updates = Object.keys(req.body)
    const allowdeUpdate = ['description', 'completed']
    const isValiOperation = updates.every((update) => allowdeUpdate.includes(update))
    if (!isValiOperation) {
        return res.status(404).send({ error: "invali" })
    }
    try{
        const task = await Task.findByIdAndUpdate(req.params.id,req.body)
        if(!task){
            throw new Error()
        }
        res.send(task)
    }catch(e){
        res.status(404).send()
    }
})

router.delete('/tasks/:id', async(req,res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            res.status(400).send()
        }
        res.send(task)
    }catch(e){
        res.status(400).send()
    }
})

module.exports = router