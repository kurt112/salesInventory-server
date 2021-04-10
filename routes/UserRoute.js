const express = require('express')
let router = express.Router()
const {User, Store} = require('../models')
router.post('/insert', async (req, res) => {

    await User.create(req.body).then(e => {
        res.send(e)
    }).catch(ignored => {
        res.status(400).send({
            title: 'Email Should be unique',
            message: 'User email is existing'
        })
    })

    res.send(user)
})

router.get('/list', (req, res) => {
    User.findAll({
        include: [
            {model: Store}
        ]

    }).then((user) => {
        res.send(user)
    }).catch((error) => {
        console.log(error);
    })
})


router.post('/delete', async (req, res) => {

    let error;
    try {
        const user = await User.destroy({
            where: {
                email: req.body.email
            }
        })

        if (user === 0) throw new Error('No user Deleted')
    } catch (e) {
        error = e
    }


    if (error) {
        res.status(400).send({
            title: `User Delete`,
            message: `Deleting this user can cause fatal error`
        })
    } else res.send("User Deleted Success")


})


module.exports = router

