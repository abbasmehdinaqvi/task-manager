const request = require('supertest')
const User=require('../src/models/users')
const app=require('../src/app')

const { userOneId, userOne , initDatabase} = require('./fixtures/db-init')
beforeEach(initDatabase)

test('Should create user',async ()=>{
    const response = await request(app)
        .post('/users')
        .send({
        name : 'Test Guy',
        email : 'test123@gmail.com',
        password : 'mypass123'
        })
        .expect(201)
        const user = await User.findById(response.body.user._id)
        expect(user).not.toBeNull()
        expect(response.body.token).not.toBeNull()
        expect(response.body).toMatchObject({
            user : {
                name : 'Test Guy',
                email : 'test123@gmail.com'
            },
            token : user.tokens[0].token
        })
        
})

test('Should Login', async ()=>{
    const response = await request(app)
        .post('/users/login')
        .send({
        email : userOne.email,
        password : userOne.password
        })
        .expect(200)
        const user = await User.findById(userOneId)
        expect(response.body.token).toBe(user.tokens[1].token)

}) 

test('Should Not Login a non-existing user', async ()=>{
    await request(app)
        .post('/users/login')
        .send({
        email : 'Test123@gmail.com',
        password : userOne.password
        })
        .expect(400)
}) 

test('Should get profile for user', async ()=>{
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async ()=>{
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete profile for user', async ()=>{
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
        const user = await User.findById(userOneId)
        expect(user).toBeNull()
})

test('Should not delete profile for unauthenticated user', async ()=>{
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload Avatar',async ()=>{
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar','tests/fixtures/profile-pic.jpg')
        .expect(200)
        const user = await User.findById(userOneId)
        expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid field', async ()=>{
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name : 'Test2'
        })
        .expect(200)
        const user = await User.findById(userOneId)
        expect(user.name).toEqual('Test2')
})

test('Should  not update invalid field', async ()=>{
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            address : 'Test2'
        })
        .expect(400)
})

