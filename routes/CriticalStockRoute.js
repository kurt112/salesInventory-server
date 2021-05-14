const express = require('express')
let router = express.Router()
const {CriticalStock,Store, Product} = require('../models')

router.get('/list', async (req, res) => {

    const criticalProduct = await CriticalStock.findAll({
        include: [
            {model: Store}
        ]
    })

    res.send(criticalProduct)
})

router.post('/update', async (req, res) => {

    const {
        productCode,
        StoreId,
        critical_level,
    } = req.body

    const critical = await CriticalStock.findOne({
        where: {
            productCode,
            StoreId
        }
    })

    if(critical === null) {
        return res.status(400).send({
            title: 'Product Code Error',
            message: 'Please Use A Valid Product Code'
        })
    }

    const count = await Product.count({
        where: {
            StoreId: StoreId,
            code: productCode,
            status: 'Available'
        }
    })

    let status = count === 0? 'Empty': count <=critical_level? 'Warning': 'Good'

    await CriticalStock.update({
        critical_level,
        status
    }, {
        where: {
            productCode,
            StoreId
        }
    })


    res.send("Ok")
})







module.exports = router