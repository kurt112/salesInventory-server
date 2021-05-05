const express = require('express')
let router = express.Router()
const {Store,User} = require('../models')
const EncryptPassword = require("../utils/HashedPassword");

router.post('/storeFind', async (req, res) => {

    const {code} = req.body

    const data = await Store.findOne({
        where: {
            code
        }
    })
    if (data === null) {
        res.status(400).send({
            title: 'Branch Not Found',
            message: 'Enter Proper Branch Code'
        })
    } else {
        res.send(data)
    }
})

router.post('/userFind', async (req,res) => {

    console.log(req.body)
    const data = await User.findOne({
        where: req.body
    })


    if(data === null){
        res.status(400).send({
            title: 'User Not Found',
            message: 'Enter Proper User Email'
        })
    }else{
        res.send(data)
    }
})

router.post('/updatePassword', async (req,res) => {

    req.body.password = await EncryptPassword(req.body.password)
    const data = await User.update(
        {password: req.body.password},{
        where: {
            id: req.body.id
        }
    })

    if(data === undefined){
        res.status(400).send({
            title: 'User Not Found',
            message: 'Enter Proper User Email'
        })
    }else{
        res.send(data)
    }
})

module.exports = router