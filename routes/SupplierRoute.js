const express = require('express')
let router = express.Router()
const {Supplier} = require('../models')

router.get('/insert', async (req, res) => {
    const supplier = await Supplier.create({
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

    res.send(supplier)
})

router.get('/select', (req, res) => {
    Supplier.findAll({
        // where: {firstName: "John"}
    }).then((supplier) => {
        res.send(supplier)
    }).catch((error) => {
        console.log(error);
    })
})


router.get('/delete', (req, res) => {
    Supplier.destroy({where: {id: 1}})
    res.send()
})


module.exports = router