const request = require('supertest')
const Task = require('../src/models/tasks')
const app=require('../src/app')

const { userOneId, userOne , initDatabase, userTwo, taskOne} = require('./fixtures/db-init')
beforeEach(initDatabase)


test('Should create task for user',  async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description : 'Test Jest.'
        })
        .expect(201)
        const task = await Task.findById(response.body._id)
        expect(task).not.toBeNull()
        expect(task.completed).toEqual(false)
})

test('Should fetch task for user',  async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
        expect(response.body.length).toEqual(2)
})

test('Should not delete others task',  async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull 
})