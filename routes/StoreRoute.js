const express = require('express')
let router = express.Router()
const {Store} = require('../models')
const Insert=  require('../utils/InsertAuditTrail')
router.post('/insert', async (req, res) => {
    const user = req.user.user
    const store = await Store.create(req.body).catch(err => {
        if (err) {
            console.log(err);
        }
    })
    Insert(user.StoreId,user.id,
        ' Added Branch ' + store.location + ' In Branch ' + user.Store.location,0)
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
    const user = req.user.user

    try {
        const result = await Store.update(req.body,
            {
                where:
                    {
                        code
                    }
            }
        )

        Insert(user.StoreId,user.id,
            ' Update Branch ' + result.location + ' In Branch ' + user.Store.location,0)
        res.send(result)
    } catch (ignored) {
        res.status(400).send({
            title: `No Branch Detected`,
            message: `Can't Update Branch    `
        })
    }
})


router.post('/delete', async (req, res) => {
    const user = req.user.user
    const {code} = req.body
    let error;
    try {
        const branch = await Store.destroy({
            where: {code}
        })

        if (branch === 0) throw new Error('No Branch Detected')
        Insert(user.StoreId,user.id,
            ' Delete Branch ' + code + ' In Branch ' + user.Store.location,0)
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