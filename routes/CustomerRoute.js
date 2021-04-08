const express = require('express')
let router = express.Router()
const {Customer} = require('../models')
router.get('/insert', async (req, res) => {
    const supplier = await Customer.create({
        name: "Pedre",
        email: "password",
        address: "kurt",
        city: "orioque",
        state: "San Mateo",
        postalCode: 2,
        mobile_no:'0961714338',
        tel_no:2
    }).catch(err => {
        if (err) {
            console.log(err);
        }
    })

    res.send(supplier)
})

router.get('/list', (req, res) => {
    Customer.findAll({
        // where: {firstName: "John"}
    }).then((supplier) => {
        res.send(supplier)
    }).catch((error) => {
        console.log(error);
    })
})


router.get('/delete', (req, res) => {
    Customer.destroy({where: {id: 1}})
    res.send()
})


module.exports = router