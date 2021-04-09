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

router.get('/update', async (req,res) => {
    try {
        const result = await Product.update(
            { brand: 'Updating bitch' },
            { where: { code: 12345} }
        )

        console.log(result)
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


router.get('/delete', (req, res) => {
    Product.destroy({where: {id: 1}})
    res.send()
})

router.get("/getImage", (req, res) => {
    const {picture} = req.query
    const pic = path.join(__dirname, '../uploads/image', picture)
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


module.exports = router