const express = require('express')
const {Sequelize} = require("sequelize");
let router = express.Router()
const {TransferProduct, Store, Product, CriticalStock} = require('../models')
const Insert = require('../utils/InsertAuditTrail')
const {Op} = require("sequelize");

router.post('/product', async (req, res) => {
    const user = req.user.user
    const {code, From, ArrangeBy, ToId} = req.body
    const products = req.body.products

    const productCode = new Set()
    for (let i = 0; i < products.length; i++) {
        productCode.add(products[i].code)
        const data = {
            code,
            From: From,
            ArrangeBy: ArrangeBy,
            To: ToId.id,
            ProductId: products[i].id,
            status: 0
        }

        await TransferProduct.create(data)
            .then(ignored => {
            }).catch(error => {
                console.log(error)
            })

        await Product.update({
            status: 'On The Way'
        }, {
            where: {id: products[i].id}
        })
    }

    for (let codeSet of productCode) {

        const data = {
            status: 'Available',
            StoreId: From,
            code: codeSet,
        }

        const criticalStock = await CriticalStock.findOne({
            where: {
                StoreId: From,
                productCode: codeSet
            }
        })

        await Product.count({
            where: data
        }).then(e => {
            if (e === 0) {
                CriticalStock.update({
                        status: 'Empty'
                    },
                    {
                        where: {
                            id: criticalStock.id
                        }
                    })
            } else if (e <= criticalStock.critical_level) {
                CriticalStock.update({
                        status: 'Warning'
                    },
                    {
                        where: {
                            id: criticalStock.id
                        }
                    })
            }
        })
    }


    Insert(user.StoreId, user.id,
        'Created Transfer Code ' + code + ' In Branch ' + user.Store.location, 0)
    res.send('data')
})

router.post('/receive', async (req, res) => {
    const user = req.user.user
    const {code} = req.body
    const productCode = new Set()
    const transfer = await TransferProduct.findOne({
        where: {code}
    })


    if (parseInt(user.StoreId) !== parseInt(transfer.To)) {
        return res.status(400).send({
            title: `Transfer Code Is Not For Your Branch`,
            message: `Please Input Proper Code For Your Branch`
        })
    }


    await TransferProduct.findAll({
        where: {code},
        include: [
            {model: Product}
        ]
    }).then(e => {
        for (let i = 0; i < e.length; i++) {
            productCode.add(e[i].dataValues.Product.code)
            Product.update(
                {
                    status: 'Available',
                    StoreId: transfer.To
                },
                {
                    where:
                        {
                            id: e[i].dataValues.ProductId
                        },
                })
        }
    }).catch(error => {
        console.log(error)
    })

    res.send("Transfer Product Success")

    await Store.update({requesting: 0}, {
        where: {id: user.StoreId}
    }).then(ignored => {
        Insert(user.StoreId, user.id,
            'Store Request Stock Fulfilled In Branch ' + user.Store.location, 0)
    }).catch(ignored => {

    })

    await TransferProduct.update(
        {status: 1}, {
            where: {code}
        })
        .then(ignored => {
            Insert(user.StoreId, user.id,
                'Receive Transfer Products' + code + ' In Branch ' + user.Store.location, 0)
        }).catch(ignored => {
        return res.status(400).send({
            title: `Error Receive Code`,
            message: `Please Input Proper Code For Receiving`
        })
    })

    for (let codeSet of productCode) {

        const criticalStock = await CriticalStock.findOne({
            where: {
                StoreId: transfer.To,
                productCode: codeSet
            }
        })

        console.log(criticalStock)

        await Product.count({
            where: {
                status: 'Available',
                StoreId: transfer.To,
                code: codeSet,
            }
        }).then(e => {
            console.log("The status")
            console.log(e)
            console.log(criticalStock.critical_level)
            if (e > criticalStock.critical_level) {
                CriticalStock.update({
                        status: 'Good'
                    },
                    {
                        where: {
                            id: criticalStock.id
                        }
                    })
            } else if (e <= criticalStock.critical_level) {
                CriticalStock.update({
                        status: 'Warning'
                    },
                    {
                        where: {
                            id: criticalStock.id
                        }
                    })
            }
        })
    }

})

router.get('/receiveList', async (req, res) => {
    const user = req.user.user
    let {page, size, search} = req.query

    size = size === undefined ? 20 : size
    page = page === undefined ? 0 : page
    search = search === undefined ? '' : search

    const data = {
        status: 1,
        to: user.StoreId,
        [Op.or]: [
            {code: {[Op.like]: '%' + search + '%'}},
        ]
    }
    await TransferProduct.findAndCountAll({
        limit: parseInt(size),
        offset: parseInt(page) * parseInt(size),
        include: {all: true},
        where: data,
        order: [['createdAt', 'DESC']],
    }).then(e => {
        res.send(e)
    }).catch(data => {
        console.log(data)
        res.status(400).send("Can't Get Data")
    })
})

router.post('/delete', async (req, res) => {
    const {code} = req.body
    const user = req.user.user
    let error = false

    await TransferProduct.destroy({
        where: {code}
    }).catch(ignored => {
        error = true
    })

    if (error) {
        res.status(404).send({message: "Can't Delete This Item"})
    } else {
        Insert(user.StoreId, user.id,
            'Deleted Transfer Code ' + code + ' In Branch ' + user.Store.location, 0)
        res.send({message: 'Deleted Success'})


    }

})


router.get('/onTheWay', async (req, res) => {
    await TransferProduct.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('code')), 'code'],
        ],
        where: {status: 0}
    }).then(e => {
        res.send(e)
    }).catch(ignored => {
        res.status(400).send("Can't Get Data")
    })


})


module.exports = router