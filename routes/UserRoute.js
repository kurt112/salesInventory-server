const express = require('express')
let router = express.Router()
const {User} = require('../models')

router.get('/insert', async (req, res) => {
    const user = await User.create({
        email: "Pedre",
        password: "password",
        firstName: "kurt",
        lastName: "orioque",
        role: 1,
        status: 2,
    }).catch(err => {
        if (err) {
            console.log(err);
        }
    })

    res.send(user)
})

router.get('/select', (req, res) => {
    User.findAll({
        // where: {firstName: "John"}
    }).then((user) => {
        res.send(user)
    }).catch((error) => {
        console.log(error);
    })
})


router.get('/delete', (req, res) => {
    User.destroy({where: {id: 1}})
    res.send('delete')
})


module.exports = router