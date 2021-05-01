const express = require('express')
const path = require('path')
let router = express.Router()
const ImageFolder = path.join(__dirname, '../uploads/image')
const fs = require('fs');
const {Product, Supplier, Store, ProductType, Setting} = require('../models')
const verify = require('../utils/jwt')
const {Sequelize} = require("sequelize");

router.post('/insert', verify, async (req, res) => {

    let qty = req.body.qty

    console.log(req.body)

    while (qty !== 0) {
        await Product.create(req.body).catch(err => {
            if (err) {
                console.log(err);
            }
        })

        qty--
    }

    res.send("ok")
})

router.post('/update', verify, async (req, res) => {

    const {
        brand,
        code,
        name,
        type,
        price,
        SupplierId,
        StoreId,
        photo,
        oldCode
    } = req.body

    const data = {
        brand,
        code,
        name,
        type,
        price,
        SupplierId,
        StoreId,
        photo,
    }

    try {
        await Product.update(data,
            {where: {code: oldCode}}
        )

    } catch (err) {
        console.log(err)
    }

    res.send("Success")
})

router.get('/list', verify, (req, res) => {

    const branch = parseInt(req.query.branch)
    const status = req.query.status
    const data = {
        status: status,
        StoreID: req.query.branch
    }

    if (branch === 0) {
        delete data.StoreID
    }

    Product.findAll({
        include: [
            {model: Supplier},
            {model: Store},
            {model: ProductType}
        ],
        where: data
    }).then((product) => {
        res.send(product)
    }).catch((error) => {
        console.log(error);
    })
})


router.post('/delete', verify, async (req, res) => {
    let qty = req.body.qty
    const code = req.body.code


    const size = await Product.findAll({
        where: {
            code
        }
    })

    if (size.length === 0) {
        res.status(400).send({
            title: 'Product Not Found',
            message: 'User Barcode to find product'
        })
    }

    if (qty > size.length) {
        res.status(400).send({
            title: 'Quantity Error',
            message: 'Quantity not enough'
        })
    } else {
        await Product.destroy(
            {
                limit: qty,
                where: {code: code}
            }
        ).then(e => {
            console.log(e)
        }).catch(error => {
            console.log(error)
        })

        res.send("Delete Success")
    }
})

router.get("/getImage/:name", (req, res) => {
    const {name} = req.params
    const pic = path.join(__dirname, '../uploads/image', name)
    res.sendFile(pic);
})

router.post("/deleteImage", async (req, res) => {
    const {name} = req.body
    const pic = path.join(__dirname, '../uploads/image', name)


    await fs.unlink(pic, (err => {
        if (err !== null) {
            res.status(404).send({message: 'Images Not Exist'})
        } else {
            res.send({message: 'Delete Success'})
        }
    }))

})


// get all images in the folder
router.get("/images", verify, (req, res) => {
    const data = []

    fs.readdirSync(ImageFolder).forEach(file => {
        data.push(file);
    });


    res.send(data)
});


router.post("/transfer", verify, async (req, res) => {
    const {code, qty, storeID} = req.body

    const data = await Product.findAll({
        where: {code},
        limit: qty
    })

    if (data.length === 0) {
        res.status(400).send({
            title: 'Product Not Found',
            message: 'Use Barcode to find product'
        })
    } else if (data.length === qty) {
        console.log("I am here")
        await Product.update({StoreId: storeID}, {
                limit: qty,
                where: {code}
            }
        )
        console.log("I am updated")
        res.send("Transfer Product Success")

    } else {
        res.status(400).send({
            title: 'Quantity Error',
            message: 'Quantity not enough'
        })
    }
})

router.post('/find', verify, async (req, res) => {

    const {code} = req.body

    const data = await Product.findAll({
        limit: 1,
        include: [
            {model: ProductType}
        ],
        where: {code}
    })

    if (data.length === 0) {
        res.status(400).send({
            title: 'Product Not Found',
            message: 'User Barcode to find product'
        })
    } else {
        res.send(data)
    }
})


module.exports = router