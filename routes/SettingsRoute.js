const express = require('express')
let router = express.Router()
const {Setting, ProductType, Product, Store} = require('../models')

const Insert = require('../utils/InsertAuditTrail')
const {Sequelize} = require("sequelize");

router.post('/insertProductType', async (req, res) => {
    const user = req.user.user
    const {name} = req.body
    const productType = await ProductType.create({
        name
    }).catch(ignored => {
        res.status(404)
    })

    Insert(user.StoreId, user.id,
        'Added Product Type ' + name + ' In Branch ' + user.Store.location, 0)


    res.send(productType)
})

router.get('/productTypeList', async (req, res) => {
    await ProductType.findAll({}).then(e => {
        return res.send(e)
    }).catch(error => {
        return res.send(error)
    })
})

router.post('/deleteProductType', async (req, res) => {
    const user = req.user.user
    const {name} = req.body
    let error = false

    const productType = await ProductType.findOne({
        where: {name}
    })

    if (productType.id === 1) {
        return res.status(404).send({message: "Can't Delete This Item"})
    }


    await ProductType.destroy({
        where: {name}
    }).catch(ignored => {
        error = true
    })

    if (error) {
        res.status(404).send({message: "Can't Delete This Item"})
    } else {
        Insert(user.StoreId, user.id,
            'Delete Product Type ' + name + ' In Branch ' + user.Store.location, 0)
        res.send({message: 'Deleted Success'})
    }
})

router.post('/setCriticalStock', async (req, res) => {
    const user = req.user.user
    const {value} = req.body
    const data = {
        critical_stock: value,
    }

    await Setting.update(data, {
        where: {id: 1}
    })

    Insert(user.StoreId, user.id,
        ' Set Critical Product Quantity To ' + value + ' In Branch ' + user.Store.location, 0)
    res.send({message: 'Update Critical Stock Success'})
})

router.get('/getCriticalStock', async (req, res) => {
    let stock = await Setting.findOne({
        where: {id: 1}
    })

    res.send({stock})
})

router.get('/getCriticalStockProduct', async (req, res) => {
    let stock = await Setting.findOne({
        where: {id: 1}
    })

    const currentCriticalStockNumber = stock.critical_stock

    const stores = []
    const criticalStock = []
    const codes = []

    await Store.findAll({}).then(e => {
        e.map((i) => {
            stores.push(i.dataValues.id)
        })
    })


    // console.log('i am here')
    // console.log(stores)

    const data = await Product.findAndCountAll({
        attributes: [Sequelize.fn('DISTINCT', Sequelize.col('code')), 'code'],
        where: {
            status: 'Available',
        },
        distinct: true,
        col: 'code'
    })
        .then(e => e)
        .catch(error => console.log(error))


    for (let i = 0; i < data.rows.length; i++) {
        codes.push(data.rows[i].code)
    }

    // console.log(codes)


    for (let i = 0; i < stores.length; i++) {
        for (let j = 0; j < codes.length; j++) {
            await Product.findAll({
                includes: [
                    {model: Store}
                ],
                where: {
                    StoreId: stores[i],
                    status: 'Available',
                    code: codes[j],
                },
                limit: currentCriticalStockNumber + 1
            }).then(e => {

                if (e.length <= currentCriticalStockNumber) {
                    if (e[0] === undefined) {
                        const getData = async () => {

                            let product = await Product.findOne({
                                where: {
                                    code: codes[j],
                                }
                            })

                            let newStore = await Store.findOne({
                                where: {id: stores[i]}
                            })

                            product.StoreId = stores[i]
                            product["Store"] = newStore


                            await criticalStock.push({
                                product,
                                branch: newStore
                            })

                            console.log(criticalStock.length)
                        }

                        getData().then(ignored => {
                        })

                    } else {

                        const getData = async () => {

                            let newStore = await Store.findOne({
                                where: {id: stores[i]}
                            })

                            criticalStock.push({
                                product: e[0].dataValues,
                                branch: newStore
                            })

                        }
                        getData().then(ignored => {
                        })

                    }
                }
            })
        }
    }
    await new Promise(r => setTimeout(r, 5000));
    res.send(criticalStock)
})


module.exports = router