const express = require('express')
const userRouter = require('./router/userR')
const taskRouter = require('./router/taskR')
require('./db/mongoose')


const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log('server connect port' + port)
})