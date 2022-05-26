const express = require('express')
const path = require('path')
require('./db/mongoose.js')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app=express()
const publicPath=path.join(__dirname,'../public')

app.use(express.static(publicPath))

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports=app