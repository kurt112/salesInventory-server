const express = require('express')
const path = require('path')
let router = express.Router()
const ImageFolder = path.join(__dirname, '../uploads/image')
const fs = require('fs');
const {Product, Supplier, Store} = require('../models')

router.post('/insert', async (req, res) => {

    let qty = req.body.qty

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

router.post('/update', async (req, res) => {

    const {  brand,
        code,
        name,
        type,
        price,
        SupplierId,
        StoreId,
        photo} = req.body

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
        const result = await Product.update(data,
            {where: {code}}
        )

    } catch (err) {
        console.log(err)
    }

    res.send("Success")
})

router.get('/list', (req, res) => {
    Product.findAll({
        include: [
            {model: Supplier},
            {model: Store},
        ]
        // where: {firstName: "John"}
    }).then((supplier) => {
        res.send(supplier)
    }).catch((error) => {
        console.log(error);
    })
})


router.post('/delete', async (req, res) => {
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
});


// get all images in the folder
router.get("/images", (req, res) => {
    const data = []

    fs.readdirSync(ImageFolder).forEach(file => {
        data.push(file);
    });


    res.send(data)
});


router.post("/transfer", async (req, res) => {
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

router.post('/find', async (req,res) => {

    const {code} = req.body

    const data = await Product.findAll({
        limit: 1,
        where: {
            code
        }
    })

    if(data.length === 0){
        res.status(400).send({
            title: 'Product Not Found',
            message: 'User Barcode to find product'
        })
    }else{
        res.send(data)
    }
})


module.exports = router