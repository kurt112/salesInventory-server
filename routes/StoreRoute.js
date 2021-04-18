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


router.post('/update', async (req, res) => {
    console.log("The id " + req.body.id)

    try {
        const result = await Store.update(req.body,
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
            title: `Store can't find`,
            message: `Can't update Store    `
        })
    }
})


router.post('/delete', async (req, res) => {

    const email = req.body.email
    console.log(email)

    let error;
    try {
        const supplier = await Store.destroy({
            where: {email}
        })

        if (supplier === 0) throw new Error('No Store')
    } catch (e) {
        error = e
    }

    if (error) {
        res.status(400).send({
            title: `Store Delete`,
            message: `Deleting this store can cause fatal error`
        })
    } else res.send("Store Deleted Success")


})

router.post('/find', async (req,res) => {

    const {email} = req.body

    const data = await Store.findAll({
        limit: 1,
        where: {
            email
        }
    })

    if(data.length === 0){
        res.status(400).send({
            title: 'Store Not Found',
            message: 'Enter Proper Store Email'
        })
    }else{
        res.send(data)
    }
})

module.exports = router