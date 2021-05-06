const express = require('express')
let router = express.Router()
const {Customer} = require('../models')
const Insert=  require('../utils/InsertAuditTrail')
router.post('/insert',async (req, res) => {
    const user = req.user.user
    const customer = await Customer.create(req.body)
        .catch(ignored=>  {
            res.status(400).send({
                title: 'Email Should be unique',
                message: 'Customer email is existing'

            })
        })
    Insert(user.StoreId,user.id,
        ' Created Customer With The Email Of ' + customer.email + user.Store.location,0)
    res.send(customer)
})

router.post('/update', async (req,res) => {
    const user = req.user.user

    await Customer.update(req.body, {
        where: {id: req.body.id}
    }).then(e => {
        console.log(e)
        Insert(user.StoreId,user.id,
            ' Updated Customer With The Email Of ' + req.body.email + user.Store.location,0)
        res.send(e)
    }).catch(ignored => {
        res.status(400).send({
            title: 'Email Should be unique',
            message: 'Customer email is existing'

        })
    })
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
      if(e === null){
          res.status(400).send({
              title: 'Customer Not Found',
              message: 'Please Input A Existing Customer'
          })
      }else{
          res.send(e)
      }
    }).catch(error => {
        console.log(error)
        res.status(404).send(error)
    })

})




module.exports = router