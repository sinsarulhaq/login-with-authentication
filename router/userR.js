const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const Task = require('../models/task')
const multer = require('multer')
const sharp = require('sharp')
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

router.get('/users/me', auth, async (req, res) => {
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

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send({ message: 'logout from this device' })
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.token = []
        await req.user.save()
        res.send({ message: 'logout from all devices' })
    } catch (e) {
        res.status(500).send(e)
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

router.patch('/users/update', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowdeUpdate = ['name', 'email', 'password', 'age']
    const isValiOperation = updates.every((update) => {
        return allowdeUpdate.includes(update)
    })
    if (!isValiOperation) {
        return res.status(400).send({ error: 'invalid updates' })
    }
    try {
        const user = await User.findByIdAndUpdate(req.user._id, req.body)
        if (!user) {
            return res.status(404).send()
        }
        res.status(201).send(user)
    } catch (e) {
        res.status(404).send(user)
    }
})

router.delete('/users/delete', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.status(201).send(user)
    } catch (e) {
        res.status(404).send(e)
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg |jpeg|png)$/)) {
            return cb(new Error('pleade upload pnj,jpg or jpeg'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height:250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async(req, res)=>{
    req.user.avatar = undefined  // or use []
    await req.user.save()
})

router.get('/users/:id/avatar', async(req, res)=>{
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/jpg')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

module.exports = router