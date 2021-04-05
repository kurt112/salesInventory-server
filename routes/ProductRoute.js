const express = require('express')
let router = express.Router()
const {Product} = require('../models')

router.get('/insert', async (req, res) => {
    const product = await Product.create({
        brand: "Pedre",
        name: "password",
        type: "kurt",
        price: 20,
        SupplierId: 1,
        StoreId: 1,
    }).catch(err => {
        if (err) {
            console.log(err);
        }
    })

    res.send(product)
})

router.get('/select', (req, res) => {
    Product.findAll({
        // where: {firstName: "John"}
    }).then((supplier) => {
        res.send(supplier)
    }).catch((error) => {
        console.log(error);
    })
})


router.get('/delete', (req, res) => {
    Product.destroy({where: {id: 1}})
    res.send()
})


module.exports = router