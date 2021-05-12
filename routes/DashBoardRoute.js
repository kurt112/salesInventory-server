const express = require('express')
let router = express.Router()
const moment = require('moment')
const {Sequelize} = require("sequelize");
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

    const products = await Product.findAndCountAll({
        where: {
            status: 'Available'
        }
    }).then((product) => product)
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
    const user = req.user.user
    const startDate = moment().format('YYYY-MM-DD 00:00')
    const endDate = moment().format('YYYY-MM-DD 23:59')
    const data = {
        StoreId: user.StoreId,
        "createdAt": {[Op.between]: [startDate, endDate]},
    }

    if (user.role === 3) {
        delete data.StoreId
    }

    await AuditTrail.findAll({
        include: [
            {model: User},
            {model: Store}
        ],
        where: data

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

    const sales = await Sales.findAll({
        include: [
            {model: Product}
        ]
    }).then(sale => sale).catch(error => {
        console.log(error)
    })


    await sales.map(e => {
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

    const nameData = []
    const to_return = []
    for (let product of mapCount.keys()) {

        let name = productMap.get(product).name
        if (nameData.includes(name)) {
            name = name + '(1)'
        }

        nameData.push(name)


        const data = {
            name: name,
            uv: parseInt(mapCount.get(product)),
            pv: parseInt(mapCount.get(product)),
            amt: parseInt(mapCount.get(product)),
        }

        to_return.push(data)
    }
    console.log(nameData)

    to_return.sort((a, b) => b.amt - a.amt)


    res.send(to_return.splice(0, 10))
})

router.get('/slowPaceProduct', async (req, res) => {
    const products = await Product.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('code')), 'code'],
        ]
    })

    const codes = []

    await products.map(product => {
        codes.push(product.code)
    })

    const mapCount = new Map()
    for (let i = 0; i < codes.length; i++) {
        await Product.findOne({
            where: {code: codes[i]}
        }).then(e => {
            mapCount.set(codes[i], e.dataValues)
        }).catch(error => {
            console.log(error)
        })
    }
    let to_return = []

    const dataProductDate = new Map


    for (let product of mapCount.keys()) {
        const date = moment(mapCount.get(product).createdAt).format('ll')
        if (dataProductDate.get(date) === undefined) {
            dataProductDate.set(date, [])
        }

        dataProductDate.get(date).push(mapCount.get(product))

    }

    for(let date of dataProductDate.keys()){
        const newData = []

        await dataProductDate.get(date).map((e, i) => {
            newData.push(
                { product: e.name, index: i, value: date }
            )
        })

        const data = {
            date,
            products: newData
        }
       to_return.push(data)
    }

    to_return = to_return.sort((a, b) => {

        return  new Date(a.date) - new Date(b.date);
    })

    res.send(to_return.splice(0,10))
})


module.exports = router