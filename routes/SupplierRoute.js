const express = require('express')
let router = express.Router()
const {Supplier} = require('../models')

router.post('/insert', async (req, res) => {

    const supplier = await Supplier.create(req.body)
        .catch(err => {
            if (err) {
                console.log(err);
            }
        })

    res.send(supplier)
})

router.get('/list', (req, res) => {4
    Supplier.findAll({
        // where: {firstName: "John"}
    }).then((supplier) => {
        res.send(supplier)
    }).catch((error) => {
        console.log(error);
    })
})


router.post('/update', (req, res) => {

})


router.get('/delete', (req, res) => {
    Supplier.destroy({where: {id: 1}})
    res.send()
})


module.exports = router