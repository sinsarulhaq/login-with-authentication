const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


//routers
router.post('/users', async (req, res) => {
    try {
        const user = await User(req.body)
        const tokens = await user.generateAuthToken()
        await user.save()
        res.status(201).send({ user, tokens })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users/me', auth, async(req, res)=>{
    res.send(req.user)
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByChecking(req.body.email, req.body.password)
        const tokens = await user.generateAuthToken()
        res.status(200).send({ user, tokens })
    } catch (e) {
        console.log(e)
        res.status(404).send(e)
    }
})

router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        res.status(201).send(user)
    } catch (e) {
        res.status(404).send(e)
    }
})

router.patch('/users/update/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowdeUpdate = ['name', 'email', 'password', 'age']
    const isValiOperation = updates.every((update) => {
        return allowdeUpdate.includes(update)
    })
    if (!isValiOperation) {
        return res.status(400).send({ error: 'invalid updates' })
    }
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body)
        if (!user) {
            return res.status(404).send()
        }
        res.status(201).send(user)
    } catch (e) {
        res.status(404).send(user)
    }
})

router.delete('/users/delete/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        res.status(201).send(user)
    } catch (e) {
        res.status(404).send(e)
    }
})


module.exports = router