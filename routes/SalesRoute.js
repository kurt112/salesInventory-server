const moment = require('moment')
const express = require('express')
const {Op} = require("sequelize");
let router = express.Router()
const {Sales, Product, Transaction} = require('../models')
router.get('/insert', async (req, res) => {
    const user = req.user.user
    console.log(user.StoreId)
    const sales = await Sales.create({
        id: 1,
        qty: 10,
        total: 20,
        ProductId: 6,
        TransactionId: 1,
        StoreId: user.StoreId
    }).catch(err => {
        res.send(err)
    })

    res.send(sales)
})

router.get('/list', async (req, res) => {

    const {startDate,endDate} = req.query
    const branch = parseInt(req.query.branch)

    const startMoment = moment(startDate).format('YYYY-MM-DD 00:00')
    const endMoment = moment(endDate).format('YYYY-MM-DD 23:59')

    const data = {
        "createdAt": {[Op.between]: [startMoment, endMoment]},
        StoreId: req.query.branch
    }

    if (branch === 0) {
        delete data.StoreId
    }


    await Sales.findAll({
        include: [
            {model: Product},
            {model: Transaction}
        ],
       where: data,
    }).then((supplier) => {
        res.send(supplier)
    }).catch((error) => {
        console.log(error);
    })
})

router.get('/delete', (req, res) => {
    sales.destroy({where: {id: 1}})
    res.send()
})


module.exports = router