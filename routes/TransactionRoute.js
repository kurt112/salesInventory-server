const express = require('express')
let router = express.Router()
const {Transaction, Customer, Store, User, Product, Sales} = require('../models')
const Insert = require('../utils/InsertAuditTrail')
router.post('/insert', async (req, res) => {
    const user = req.user.user
    const item = req.body.items


    const transaction = await Transaction.create(req.body).catch(err => {
        if (err) {
            return res.status(404).send(err)
        }
    })

    Insert(user.StoreId, user.id,
        ' Created Transaction With The Code Of ' + transaction.code + ' With The Total Of ₱ ' + transaction.amount + ' In Branch ' + user.Store.location, transaction.amount)

    for (let i = 0; i < item.length; i++) {
        let qty = item[i].qty

        while (qty !== 0) {
            const product = await Product.findOne({
                where: {
                    code: item[i].code,
                    status: 'Available'
                }
            })

            await Sales.create({
                TransactionId: transaction.id,
                ProductId: product.id,
                StoreId: user.StoreId
            }).catch(error => {
                console.log(error)
            })


            await Product.update(
                {status: 'Sold'},
                {where: {id: product.id}}
            )
            qty--
        }
    }


    res.send(transaction)
})

router.get('/list', (req, res) => {
    Transaction.findAll({
        include: [
            {model: Store},
            {model: Customer},
            {model: User}
        ]
        // where: {firstName: "John"}
    }).then((supplier) => {
        res.send(supplier)
    }).catch((error) => {
        console.log(error);
    })
})

router.post('/find', async (req, res) => {

    const {code} = req.body

    const transaction = await Transaction.findOne({
        include: [
            {model: Store},
            {model: Customer},
            {model: User}
        ],
        where: {code}
    })


    if (transaction === null) {
        return res.status(400).send({
            title: 'Transaction Not Found',
            message: 'Enter Proper Transaction Code'
        })
    }

    const sales = await Sales.findAll({
        include: [
            {model: Product}
        ],
        where: {TransactionId: transaction.id}
    })

    const data = {
        transaction,
        sales
    }


    res.send(data)
})

router.post('/returnItem', async (req, res) => {
    const {ProductId, TransactionId, code, reason} = req.body
    const user = req.user.user

    await Sales.destroy({
        where: {
            TransactionId,
            ProductId
        },
        limit: 1
    })

    await Product.destroy({
        where: {
            id: ProductId
        }
    })

    Insert(user.StoreId, user.id,
        'Returned Product In Transaction With The Code Of ' + code + ' With The Reason Of ' + reason + ' In Branch ' + user.Store.location, 0)


    res.send('nice')
})


router.get('/delete', (req, res) => {
    Transaction.destroy({where: {id: 1}})
    res.send()
})


module.exports = router