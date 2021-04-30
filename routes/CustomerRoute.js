const express = require('express')
let router = express.Router()
const {Customer} = require('../models')

router.post('/insert', async (req, res) => {
    const customer = await Customer.create(req.body)
        .catch(ignored=>  {
            res.status(400).send({
                title: 'Email Should be unique',
                message: 'Customer email is existing'

            })


        })
    res.send(customer)
})


router.get('/list', async (req, res) => {
    await Customer.findAll({
        // where: {firstName: "John"}
    }).then((supplier) => {
        res.send(supplier)
    }).catch((error) => {
        console.log(error);
    })
})

router.post('/find', async (req, res) => {
    const {email} = req.body

    await Customer.findOne({
        where: {email}
    }).then(e => {
        res.send(e)
    }).catch(error => {
        console.log(error)
        res.status(404).send(error)
    })

})


router.get('/delete', (req, res) => {
    Customer.destroy({where: {id: 1}})
    res.send()
})


module.exports = router