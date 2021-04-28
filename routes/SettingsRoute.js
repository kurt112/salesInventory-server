const express = require('express')
let router = express.Router()
const {Setting, ProductType} = require('../models')


router.post('/insertProductType', async (req, res) => {

    const {name} = req.body
    const productType = await ProductType.create({
        name
    }).catch(ignored => {
        res.status(404)
    })

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

    const {name} = req.body
    let error = false
    await ProductType.destroy({
        where: {name}
    }).catch(ignored => {
        error = true
    })

    if (error) {
        res.status(404).send({message: "Can't Delete This Item"})
    } else {
        res.send({message: 'Deleted Success'})
    }
})

router.post('/setCriticalStock', async (req, res) => {

    const {value} = req.body
    const data = {
        critical_stock: value,
    }

    await Setting.update(data, {
        where: {id: 1}
    })


    res.send({message: 'Update Critical Stock Success'})
})

router.get('/getCriticalStock', async (req, res) => {
    const data = {
        critical_stock: 1,
    }

    let stock = await Setting.findOne({
        where: {id: 1}
    })

    if (stock === null) {
        stock = await Setting.create(data).catch(error => {
            console.log(error)
        })
    }

    res.send({stock})
})


module.exports = router