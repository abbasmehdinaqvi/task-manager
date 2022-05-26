const app=require('./app')
const port=process.env.PORT

app.listen(port, ()=>{
    console.log('Server is up on port '+port)
})





















// const jwt =require('jsonwebtoken')


// const myfunc= async ()=>{
//     const token =jwt.sign({name : "anything"},'howyoudoin',{expiresIn: '1 hour'})

//     const data = jwt.verify(token,'howyoudoin')
//     console.log(data)

// }
// myfunc()


// const Task = require('./models/tasks')
// const User= require('./models/users')
// const myfunc= async ()=>{
//     const task = await Task.findById('5ee0ceef7d5e6e2e205ba866')
//     await task.populate('owner').execPopulate()
//     console.log(task.owner)

//     const user= await User.findById('5ee0c9512ed36805603691c8')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)


// }
// myfunc()


// populate function can populate a field 
// by its ref relationship in the model 
