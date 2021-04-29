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
    Store.findAll({}).then((supplier) => {
        res.send(supplier)
    }).catch((error) => {
        console.log(error);
    })
})


router.post('/update', async (req, res) => {
    const {code} = req.body
    console.log(req.body)
    try {
        const result = await Store.update(req.body,
            {
                where:
                    {
                        code
                    }
            }
        )
        console.log(result)
        res.send(result)
    } catch (ignored) {
        res.status(400).send({
            title: `No Branch Detected`,
            message: `Can't Update Branch    `
        })
    }
})


router.post('/delete', async (req, res) => {

    const {code} = req.body
    let error;
    try {
        const supplier = await Store.destroy({
            where: {code}
        })

        if (supplier === 0) throw new Error('No Branch Detected')
    } catch (e) {
        error = e
    }

    if (error) {
        res.status(400).send({
            title: `Branch Delete`,
            message: `Deleting This Branch Can Cause Fatal Error`
        })
    } else res.send("Branch Deleted Success")


})

router.post('/find', async (req, res) => {

    const {code} = req.body

    const data = await Store.findAll({
        limit: 1,
        where: {
            code
        }
    })

    if (data.length === 0) {
        res.status(400).send({
            title: 'Store Not Found',
            message: 'Enter Proper Store Email'
        })
    } else {
        res.send(data)
    }
})

module.exports = router