require('dotenv').config()

const express = require('express')
let router = express.Router()
const {User} = require('../models')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
router.use(bodyParser.json());

router.post('/login', async (req,res) => {
    const {username, password} = req.body


    const user = await User.findOne({
        where:{
            email: username,
            password: password
        }
    })

    if(user === null){
        res.sendStatus(404)

        return
    }

    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET)

    // console.log(accessToken)
    res.send({accessToken, user})
})

router.post('/logout', () => {
    const {token} = req.body
    jwt.JsonWebTokenError
})

router.post('/token', (req, res) => {
    const token = req.body.token
    const data =  jwt.decode(token)

    res.send(data.user)
})



router.post('/logout', (req,res) => {

})




module.exports = router