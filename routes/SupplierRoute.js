const express = require('express')
let router = express.Router()
const {Supplier} = require('../models')

router.post('/insert', async (req, res) => {

    await Supplier.create(req.body).then(e => {
        res.send(e)
    }).catch(ignored => {
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
                        id: req.body.id
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

    const email = req.body.email


    let error;
    try {
        const supplier = await Supplier.destroy({
            where: {email}
        })

        if (supplier === 0) throw new Error('No Supplier')
    } catch (e) {
        error = e
    }

    if (error) {
        res.status(400).send({
            title: `Supplier Delete`,
            message: `Deleting this supplier can cause fatal error`
        })
    } else res.send("Supplier Deleted Success")


})

router.post('/find', async (req,res) => {

    const {email} = req.body

    const data = await Supplier.findAll({
        limit: 1,
        where: {
            email
        }
    })

    if(data.length === 0){
        res.status(400).send({
            title: 'Supplier Not Found',
            message: 'Enter Proper Supplier Email'
        })
    }else{
        res.send(data)
    }
})

module.exports = router