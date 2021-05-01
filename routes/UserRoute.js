const express = require('express')
let router = express.Router()
const {User, Store} = require('../models')
const Insert=  require('../utils/InsertAuditTrail')
router.post('/insert', async (req, res) => {
    const user = req.user.user
    await User.create(req.body).then(e => {
        Insert(user.StoreId,user.id,
            ' Created User With The Email Of ' + user.email + ' In Branch ' + user.Store.location,0)

        res.send(e)
    }).catch(ignored => {
        res.status(400).send({
            title: 'Email Should be unique',
            message: 'User email is existing'
        })
    })

    res.send(user)
})

router.get('/list',(req, res) => {
    User.findAll({
        include: [
            {model: Store}
        ]

    }).then((user) => {
        res.send(user)
    }).catch((error) => {
        console.log(error);
    })
})


router.post('/delete', async (req, res) => {
    const users = req.user.user
    let error;
    try {
        const user = await User.destroy({
            where: {
                email: req.body.email
            }
        })


        if (user === 0) throw new Error('No user Deleted')

        Insert(users.StoreId,users.id,
            ' Deleted User With The Email Of ' + req.body.email + ' In Branch ' + users.Store.location,0)
    } catch (e) {
        error = e
    }


    if (error) {
        res.status(400).send({
            title: `User Delete`,
            message: `Deleting this user can cause fatal error`
        })
    } else res.send("User Deleted Success")


})

router.post('/find', async (req,res) => {

    const {email} = req.body

    const data = await User.findAll({
        limit: 1,
        where: {
            email
        }
    })

    if(data.length === 0){
        res.status(400).send({
            title: 'User Not Found',
            message: 'Enter Proper User Email'
        })
    }else{
        res.send(data)
    }
})


router.post('/update', async (req, res) => {
    const users = req.user.user
    try {
        const result = await User.update(req.body,
            {
                where:
                    {
                        id: req.body.id
                    }
            }
        )

        Insert(users.StoreId,users.id,
            ' Updated User With The Email Of ' + req.body.email + ' In Branch ' + users.Store.location,0)
        res.send(result)
    } catch (ignored) {
        console.log(ignored)
        res.status(400).send({
            title: `User can't find`,
            message: `Can't update User`
        })
    }
})




module.exports = router

