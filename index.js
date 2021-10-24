const express = require('express')
const userRouter = require('./router/userR')
require('./db/mongoose')


const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)


app.listen(port, () => {
    console.log('server connect port 3000')
})