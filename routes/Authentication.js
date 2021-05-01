require('dotenv').config()
const express = require('express')
let router = express.Router()
const {User,Store} = require('../models')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const Insert=  require('../utils/InsertAuditTrail')
const verify = require('../utils/jwt')
router.use(bodyParser.json());

router.post('/login', async (req,res) => {
    const {username, password} = req.body

    const user = await User.findOne({
        include: [
            {model: Store},
        ],
        where:{
            email: username,
            password: password
        }

    }).catch(ignored => {
        return res.sendStatus(404)
    })

    if(user === null){
        return res.sendStatus(404)
    }

    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET)
    Insert(user.StoreId,user.id,
        ' Login In The System In Branch ' + user.Store.location,0)
    // console.log(accessToken)
    res.send({accessToken, user})
})

router.post('/token', (req, res) => {
    const token = req.body.token
    const data =  jwt.decode(token)

    res.send(data.user)
})



router.post('/logout', verify,(req,res) => {

    const user = req.user.user
    Insert(user.StoreId,user.id,
        ' Logout In The System In Branch ' + user.Store.location,0)
    res.send({message:'success'})
})




module.exports = router