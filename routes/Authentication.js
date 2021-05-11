require('dotenv').config()
const express = require('express')
let router = express.Router()
const {User, Store} = require('../models')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const Insert = require('../utils/InsertAuditTrail')
const verify = require('../utils/jwt')
const bcrypt = require('bcrypt')
const EncryptPassword = require("../utils/HashedPassword");
const compare = require('../utils/CompareHashPassword')
router.use(bodyParser.json());

router.post('/login', async (req, res) => {
    const {username, password} = req.body


    const user = await User.findOne({
        include: [
            {model: Store},
        ],
        where: {
            email: username
        }
    }).then(e => e).catch(ignored => {
        return res.status(400).send({
            title: 'Error Occurred',
            message: 'Error Undefined Please Contact Admin'
        })
    })

    if (user === null) {
        return res.status(400).send({
            title: 'Invalid Credentials',
            message: 'Incorrect Username And Password'
        })
    }

    const result = await compare(password, user.password)

    if (result) {
        const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET)
        Insert(user.StoreId, user.id,
            ' Login In The System In Branch ' + user.Store.location, 0)
        return res.send({accessToken, user})
    }


    return res.status(400).send({
        title: 'Invalid Credentials',
        message: 'Invalid Password'
    })
})

router.post('/token', (req, res) => {
    const token = req.body.token
    const data = jwt.decode(token)

    res.send(data.user)
})


router.post('/logout', verify, (req, res) => {

    const user = req.user.user
    Insert(user.StoreId, user.id,
        ' Logout In The System In Branch ' + user.Store.location, 0)
    res.send({message: 'success'})
})


module.exports = router