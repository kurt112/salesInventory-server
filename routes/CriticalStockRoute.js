const express = require('express')
let router = express.Router()
const {CriticalStock,Store} = require('../models')

router.get('/list', async (req, res) => {

    const criticalProduct = await CriticalStock.findAll({
        include: [
            {model: Store}
        ]
    })


    res.send(criticalProduct)

})






module.exports = router