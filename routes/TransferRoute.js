const express = require('express')
const {Sequelize} = require("sequelize");
let router = express.Router()
const {TransferProduct, Store, User,Product} = require('../models')
const Insert = require('../utils/InsertAuditTrail')

router.post('/product', async (req, res) => {
    const user = req.user.user
    const {code, From, ArrangeBy, ToId} = req.body
    const products = req.body.products

    console.log(ArrangeBy)
    for (let i = 0; i < products.length; i++) {
        const data = {
            code,
            From:From,
            ArrangeBy:ArrangeBy,
            To:ToId.id,
            ProductId: products[i].id,
            status: 0
        }

        await TransferProduct.create(data)
            .then(e => {
                console.log(e)
            }).catch(error => {
                console.log(error)
            })
    }

    Insert(user.StoreId, user.id,
        'Created Transfer Code ' + code + ' In Branch ' + user.Store.location, 0)
    res.send('data')
})

router.post('/receive', async (req, res) => {
    const {code} = req.body
    await TransferProduct.update(
        {status: 1},
        {where: {code}}
        ).then(ignored => Insert(user.StoreId, user.id,
            'Receive Transfer Products' + code + ' In Branch ' + user.Store.location, 0)).catch(ignored => {
        res.status(400).send({
            title: `Error Receive Code`,
            message: `Please Input Proper Code For Receiving`
        })
    })


})

router.get('/receiveList', async (req, res) => {

    await TransferProduct.findAll({
        include: {all: true },

        where: {
            status: 1,
            to: 2,// user.Store.id
        }
    }).then(e => {
        res.send(e.reverse())
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
        ]
    }).then(e => {
        res.send(e)
    }).catch(ignored => {
        res.status(400).send("Can't Get Data")
    })


})


module.exports = router