const express = require('express')
let router = express.Router()
const {Transaction,Customer,Store,User} = require('../models')

router.post('/insert', async (req, res) => {
    const transaction = await Transaction.create(req.body).catch(err => {
        if (err) {
           return res.status(404).send(err)
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