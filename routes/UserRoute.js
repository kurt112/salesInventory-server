const express = require('express')
let router = express.Router()
const {User, Store} = require('../models')
router.post('/insert', async (req, res) => {

    const user = await User.create(req.body).catch(err => {
        if (err) {
            console.log(err);
        }
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


router.post('/delete', async  (req, res) => {

    try{
        await User.destroy({where: {email: req.body.email}})
    }catch (error){
        console.log("I have error")
        res.status(400).send("This User Can't Delete")
    }

    res.status(200).send("Deleted User")
})


module.exports = router

