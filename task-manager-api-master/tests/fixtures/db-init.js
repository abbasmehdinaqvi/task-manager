const jwt= require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/users')
const Task= require('../../src/models/tasks')

const userOneId= new mongoose.Types.ObjectId()

const userOne={
    _id : userOneId,
    name : 'Test',
    email : 'testjest@first.com',
    password : 'TestPass!7',
    tokens :[{
        token : jwt.sign({ _id : userOneId}, process.env.JWT_SECRET)
    }]
}

const userTwoId= new mongoose.Types.ObjectId()

const userTwo={
    _id : userTwoId,
    name : 'Test2',
    email : 'testjest@second.com',
    password : 'TesttwoPass!77',
    tokens :[{
        token : jwt.sign({ _id : userTwoId}, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id : new mongoose.Types.ObjectId(),
    description : 'First Sample Task',
    completed : false,
    owner : userOneId

}
const taskTwo = {
    _id : new mongoose.Types.ObjectId(),
    description : 'Second Sample Task',
    completed : true,
    owner : userOneId

}

const taskThree = {
    _id : new mongoose.Types.ObjectId(),
    description : 'Third Sample Task',
    completed : true,
    owner : userTwoId

}

const initDatabase = async ()=>{
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports={
    userOne,
    userOneId,
    initDatabase,
    userTwo,
    taskOne
}