const express = require('express')
const {Op} = require("sequelize");
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
    const user = req.user.user

    let {page,size,search} = req.query

    size = size === undefined? 20: size
    page = page === undefined? 0: page
    search = search === undefined? '': search

    console.log(user)

    const data = {
        StoreId: user.StoreId,
        [Op.or]: [
            {action: { [Op.like]: '%' + search + '%' }},
            {'$Store.location$': { [Op.like]: '%' + search + '%' }},
            {'$User.email$': { [Op.like]: '%' + search + '%' }}
        ]
    }

    if(user.role === 3){
        delete data.StoreId
    }

    AuditTrail.findAndCountAll({
        limit: parseInt(size),
        offset: parseInt(page)*parseInt(size),
        include: [
            {model: User},
            {model: Store},
        ],
        order: [ [ 'createdAt', 'DESC' ]],
        where: data
    }).then((supplier) => {
        res.send(supplier)
    }).catch((error) => {
        console.log(error);
    })
})



router.get('/delete', (req, res) => {
    AuditTrail.destroy({where: {id: 1}})
    res.send()
})

module.exports = router