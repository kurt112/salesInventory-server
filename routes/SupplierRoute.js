const express = require('express')
let router = express.Router()
const {Supplier} = require('../models')

router.post('/insert', async (req, res) => {

    await Supplier.create(req.body).then(e => {
        res.send(e)
    }).catch(e => {
        res.status(400).send({
            title: 'Email Should be unique',
            message: 'supplier email is existing'
        })
    })
})

router.get('/list', (req, res) => {
    Supplier.findAll({
        // where: {firstName: "John"}
    }).then((supplier) => {
        res.send(supplier)
    }).catch((error) => {
        console.log(error);
    })
})


router.post('/update', async (req, res) => {
    try {
        const result = await Supplier.update(req.body,
            {
                where:
                    {
                        email: req.body.email
                    }
            }
        )
        res.send(result)
    } catch (ignored) {
        res.status(400).send({
            title: `Supplier can't find`,
            message: `Can't update Supplier`
        })
    }
})


router.post('/delete', async (req, res) => {

    await Supplier.destroy({}).then(e => {
        res.send(e)
    }).catch(ignored => {
        res.status(400).send({
            title: `Supplier can't find`,
            message: `Can't update Supplier`
        })
    })

})


module.exports = router