const express = require('express')
let router = express.Router()
const {Store} = require('../models')

router.get('/insert', async (req, res) => {
    const store = await Store.create({
        name: "Pedre",
        email: "password",
        address: "kurt",
        city: "orioque",
        state: "San Mateo",
        postal_code: 2,
        mobile_no:'0961714338',
        tel_no:2
    }).catch(err => {
        if (err) {
            console.log(err);
        }
    })

    res.send(store)
})

router.get('/select', (req, res) => {
    Store.findAll({
        // where: {firstName: "John"}
    }).then((supplier) => {
        res.send(supplier)
    }).catch((error) => {
        console.log(error);
    })
})


router.get('/delete', (req, res) => {
    Store.destroy({where: {id: 1}})
    res.send()
})


module.exports = router