const express = require('express')
let router = express.Router()
const {Transaction,Customer,Store,User} = require('../models')

router.get('/insert', async (req, res) => {
    const transaction = await Transaction.create({
        amount: 22.1,
        discount: 0.0,
        CustomerId:1,
        UserId: 6,
        StoreId: 1
    }).catch(err => {
        if (err) {
            console.log(err);
        }
    })

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


router.get('/delete', (req, res) => {
    Transaction.destroy({where: {id: 1}})
    res.send()
})


module.exports = router