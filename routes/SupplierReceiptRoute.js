const express = require('express')
let router = express.Router()
const {SupplierReceipt, Supplier, Store} = require('../models')
const verify = require('../utils/jwt')
const fs = require('fs');
const path = require('path')
const Insert = require('../utils/InsertAuditTrail')
router.get('/list', verify, async (req, res) => {
    await SupplierReceipt.findAll({
        include: [
            {model: Supplier},
            {model: Store}
        ]
    }).then((receipt) => {
        res.send(receipt)
    }).catch((error) => {
        console.log(error);
    })
})


router.get("/getImage/:name", (req, res) => {
    const {name} = req.params
    const pic = path.join(__dirname, '../uploads/receipts', name)
    res.sendFile(pic);
})


router.post('/delete', verify, async (req, res) => {
    const {code} = req.body
    const user = req.user.user
    const receipt = await SupplierReceipt.findOne({
        where: {code}
    })


    if (receipt === null) {
        return res.status(400).send({
            title: 'Receipt Code Not Found',
            message: 'Please Use Proper Receipt Code'
        })
    }

    const pic = path.join(__dirname, '../uploads/receipts', receipt.image)

    await SupplierReceipt.destroy({
        where: {code}
    })

    await fs.unlink(pic, (err => {
        if (err !== null) {
            return res.status(400).send({
                title: 'Image Not Existing',
                message: 'Deleted The Product But The Image Is Not Existing'
            })
        } else {
            Insert(user.StoreId, user.id,
                'Deleted Supplier Receipt With The Code Of ' + code + ' In Branch ' + user.Store.location, 0)

            res.send({message: 'Delete Success'})
        }
    }))

})

module.exports = router