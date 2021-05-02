const express = require('express')
let router = express.Router()
const moment = require('moment')
const {Store, Supplier, User, Product, AuditTrail, Transaction, Sales} = require('../models')

const {Op} = require('sequelize');

router.get('/data', async (req, res) => {

    const storeManager = await User.findAndCountAll({
        where: {
            role: 2
        }

    }).then((user) => user
    ).catch((error) => {
        console.log(error);
    })

    const cashier = await User.findAndCountAll({
        where: {
            role: 1
        }

    }).then((user) => user
    ).catch((error) => {
        console.log(error);
    })

    const suppliers = await Supplier.findAndCountAll()
        .then((supplier) => supplier)
        .catch((error) => console.log(error))


    const stores = await Store.findAndCountAll()
        .then((store) => store)
        .catch((error) => console.log(error))

    const products = await Product.findAndCountAll()
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


router.get('/audit', async (req, res) => {


    const startDate = moment().format('YYYY-MM-DD 00:00')
    const endDate = moment().format('YYYY-MM-DD 23:59')

    await AuditTrail.findAll({
        include: [
            {model: User},
            {model: Store}
        ],
        where: {
            "createdAt": {[Op.between]: [startDate, endDate]},
        },

    }).then(recent => {
        res.send(recent)
    }).catch(error => {
        console.log(error)
    })

})

router.get('/transaction', async (req, res) => {
    const startDate = moment().format('YYYY-MM-DD 00:00')
    const endDate = moment().format('YYYY-MM-DD 23:59')

    await Transaction.findAll({
        include: [
            {model: User},
            {model: Store}
        ],
        where: {
            "createdAt": {[Op.between]: [startDate, endDate]},
        }
    }).then(transaction => {
        res.send(transaction)
    }).catch(e => {
        console.log(e)
    })
})

router.get('/topTenSales', async (req, res) => {
    const mapCount = new Map
    const productMap = new Map

    await Sales.findAll({
        include: [
            {model: Product}
        ]
    }).then(sale => {
        sale.map(e => {
            const saleCurrent = e.dataValues
            const product = saleCurrent.Product.dataValues
            const code = product.code
            if (mapCount.get(code) === undefined) {
                mapCount.set(code, 1)
                productMap.set(code, product)
            } else {
                mapCount.set(code, mapCount.get(code) + 1)
            }


        })
    }).catch(error => {
        console.log(error)
    })

    console.log(mapCount)
    console.log(productMap)

    const to_return = []
    for (let product of mapCount.keys()) {
        const data = {
            name: productMap.get(product).name,
            uv: mapCount.get(product),
            pv: mapCount.get(product),
            amt: mapCount.get(product),
        }

        to_return.push(data)
    }

    to_return.sort((a,b) => b.amt - a.amt)


    res.send(to_return.splice(0,10))
})


module.exports = router