const express = require('express')
let router = express.Router()
const {Store} = require('../models')
router.post('/insert', async (req, res) => {
    console.log(req.body)
    const store = await Store.create(req.body).catch(err => {
        if (err) {
            console.log(err);
        }
    })

    res.send(store)
})

router.get('/list', (req, res) => {
    Store.findAll({

    }).then((supplier) => {
        res.send(supplier)
    }).catch((error) => {
        console.log(error);
    })
})


router.get('/delete', (req, res) => {
    Store.destroy({where: {id: 1}})
    res.send()
})


module.exports = router