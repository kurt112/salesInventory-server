const express = require('express')
let router = express.Router()
const {Store, Supplier, User, Product} = require('../models')
router.get('/data', async (req, res) => {

    const storeManager = await User.findAndCountAll({
        where: {
            role: 2
        }

    }).then((user) =>user
    ).catch((error) => {
        console.log(error);
    })

    const cashier = await User.findAndCountAll({
        where: {
            role: 1
        }

    }).then((user) =>user
    ).catch((error) => {
        console.log(error);
    })

    const suppliers = await  Supplier.findAndCountAll()
        .then((supplier) => supplier)
        .catch((error) => console.log(error))


    const stores = await  Store.findAndCountAll()
        .then((store) => store)
        .catch((error) => console.log(error))

    const products = await  Product.findAndCountAll()
        .then((product) => product)
        .catch((error) => console.log(error))

    const data = {
        Store: stores.count,
        Manager: storeManager.count,
        Cashier: cashier.count,
        Product: products.count,
        Supplier: suppliers.count,

    }

    res.send(data)
})


module.exports = router