const express = require('express')
const cors = require('cors')
const app = express()
const userModel = require('./database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors())
app.use(passport.initialize())

require('./passport')

app.post('/register', (req, res)=>{
    const user = new userModel({
        username : req.body.username,
        password : bcrypt.hashSync(req.body.password, 10)
    })

    user.save().then(user=>res.send('user created'))
    .catch(error =>{
        res.send('something went wrong');
    })
})

app.post('/login', (req, res)=>{
    userModel.findOne({username : req.body.username})
    .then(user =>{
        if(!user){
            return res.status(404).send('user not found')
        }
        if(!bcrypt.compareSync(req.body.password, user.password)){
            return res.status(401).send('incorrect password')
        }
        const payload ={
            username : user.username,
            id : user._id
        }

        const token = jwt.sign(payload, "hdagf")

        return res.status(200).send({
            'logged' : "success",
            token : "Bearer "+token
        })
    })
})

app.get('/protected', passport.authenticate('jwt', {session: false}), (req, res) => {
    return res.status(200).send({
        success: true,
        user: {
            id: req.user._id,
            username: req.user.username,
        }
    })
})

app.listen(5000)