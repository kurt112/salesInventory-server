const express = require('express')
const path = require('path')
let router = express.Router()
const {Product, Supplier, Store} = require('../models')

router.get('/insert', async (req, res) => {
    const product = await Product.create({
        brand: "Pedre",
        name: "password",
        type: "kurt",
        price: 20,
        SupplierId: 9,
        StoreId: 2,
        code: 1234,
    }).catch(err => {
        if (err) {
            console.log(err);
        }
    })

    res.send(product)
})

router.get('/list', (req, res) => {
    Product.findAll({
        include: [
            {model: Supplier},
            {model: Store},
        ]
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

router.get("/getImage", (req, res) => {
    const {picture} = req.query
    const pic = path.join(__dirname, '../uploads', picture)
    res.sendFile(pic);
});


module.exports = router