const express = require('express')
let router = express.Router()
const {User,Store,AuditTrail} = require('../models')

router.get('/insert', async (req, res) => {
    const audit = await AuditTrail.create({
        action: "Update the prooduct",
        value: 0,
        UserId: 6,
        StoreId: 1,
    }).catch(err => {
        if (err) {
            console.log(err);
        }
    })

    res.send(audit)
})

router.get('/list', (req, res) => {
    AuditTrail.findAll({
        include: [
            {model: User},
            {model: Store},
        ],
    }).then((supplier) => {
        res.send(supplier.reverse())
    }).catch((error) => {
        console.log(error);
    })
})



router.get('/delete', (req, res) => {
    AuditTrail.destroy({where: {id: 1}})
    res.send()
})

module.exports = router