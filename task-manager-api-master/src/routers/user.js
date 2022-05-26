const express= require('express')
const multer = require('multer')
const sharp= require('sharp')
const User = require('../models/users')
const router = express.Router()
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail }=require('../emails/account')

router.post('/users', async (req,res)=>{
    const user = new User(req.body)

    try {
        const token =await user.generateAuthToken()
        sendWelcomeEmail(user.email, user.name)
        res.status(201).send({user,token})

    } catch(e) {
        res.status(400).send(e)
    }

})

router.post('/users/login',async (req,res)=>{
    try {
        const user= await User.findByCredentials(req.body.email,req.body.password)
        const token =await user.generateAuthToken()
        res.send({user,token})
        
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout',auth,async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((tokenObj)=> {
            return tokenObj.token !== req.token
        })
        await req.user.save()
        res.send()
        
    } catch (e) {
        res.status(500).send(e)
        
    }

})

router.post('/users/logoutAll',auth,async (req,res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
        
    } catch (e) {
        res.status(500).send(e)
        
    }

})



router.get('/users/me',auth,async (req,res)=>{
    res.send(req.user)
})

router.patch('/users/me',auth, async (req,res)=>{
    const updates=Object.keys(req.body)
    const validUpdates= [ 'name','age', 'email', 'password']

    const isValid = updates.every( (update)=> validUpdates.includes(update))
    if(!isValid)
    return res.status(400).send({ error :'Invalid Updates'})

    try {
        const user= req.user

        updates.forEach( (update)=> user[update]=req.body[update])
        await user.save()
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
        
    }

})

router.delete('/users/me',auth,async(req,res)=>{
    try {
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)

    } catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    limits : {
        fileSize : 1000000
    },
    fileFilter(req,file,callback) {
        if(!file.originalname.match(/\.(png|jpeg|jpg)$/))
        {
            return callback(new Error('Please Upload an image file'))
        }
        return callback(undefined,true)
    }

})

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
   
    req.user.avatar=await sharp(req.file.buffer).resize({ width : 400, height : 400 }).png().toBuffer()
    await req.user.save()

    res.send()
},(error,req,res,next)=>{
    res.status(400).send({ error : error.message})
})

router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)

        
    } catch (error) {
        res.status(404).send()
    }

})

module.exports=router