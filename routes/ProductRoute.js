const express = require('express')
const path = require('path')
let router = express.Router()
const ImageFolder = path.join(__dirname, '../uploads/image')
const fs = require('fs');
const {Product, Supplier, Store, ProductType, CriticalStock} = require('../models')
const verify = require('../utils/jwt')
const Insert = require('../utils/InsertAuditTrail')
const {Op} = require('sequelize');

router.post('/insert', verify, async (req, res) => {
    let qty = req.body.qty, inserting = true
    const user = req.user.user
    const {code} = req.body

    while (qty !== 0) {
        await Product.bulkCreate([req.body]).catch(err => {
            if (err) {
                console.log(err);
            }
        })

        qty--
        if (inserting) {
            res.send("ok")
            inserting = false
        }
    }

    await Store.findAll().then(stores => {
        stores.map(store => {
            Product.findAll({
                limit: 2,
                where: {
                    StoreId: store.dataValues.id,
                    code
                }
            }).then(products => {
                let status = products.length === 0 ? 'Empty' : products.length === 1 ? 'Warning' : 'Good'
                CriticalStock.findOne({
                    where: {
                        StoreId: store.dataValues.id,
                        productCode: code
                    }
                }).then(criticalStock => {
                    if (criticalStock === null) {
                        CriticalStock.create({
                            StoreId: store.dataValues.id,
                            productCode: code,
                            critical_level: 1,
                            status
                        })
                    } else {
                        const level = criticalStock.critical_level
                        status = products.length === 0? 'Empty': products.length <=level? 'Warning': 'Good'
                        CriticalStock.update({
                            status
                        }, {
                            where: {id: criticalStock.id}
                        })
                    }
                })
            })

        })
    })


    Insert(user.StoreId, user.id,
        'Added Product With The Code Of ' + req.body.code + ' Quantity Of ' + req.body.qty + ' In Branch ' + user.Store.location, 0)


})

router.post('/update', verify, async (req, res) => {

    const user = req.user.user
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

    const filterData = {
        // status: 'Available',
        StoreID: user.StoreId,
        code: oldCode
    }

    try {
        await Product.update(data,
            {where: filterData}
        )

    } catch (err) {
        console.log(err)
    }

    Insert(user.StoreId, user.id,
        ' Update Product With The Code Of ' + code + ' In Branch ' + user.Store.location, 0)


    res.send("Success")
})


router.get('/list', verify, (req, res) => {

    const branch = parseInt(req.query.branch)
    const status = req.query.status
    let {page, size, search} = req.query

    size = size === undefined ? 20 : size
    page = page === undefined ? 0 : page
    search = search === undefined ? '' : search

    const data = {
        status: status,
        StoreID: branch,
        [Op.or]: [
            {code: {[Op.like]: '%' + search + '%'}},
            {brand: {[Op.like]: '%' + search + '%'}},
            {name: {[Op.like]: '%' + search + '%'}},
            {'$ProductType.name$': {[Op.like]: '%' + search + '%'}},
            {'$Supplier.name$': {[Op.like]: '%' + search + '%'}}
        ]
    }

    if (branch === 0) {
        delete data.StoreID
    }

    Product.findAndCountAll({
        limit: parseInt(size),
        offset: parseInt(page) * parseInt(size),
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

    const user = req.user.user
    let qty = req.body.qty
    const {code} = req.body

    const data = {
        status: 'Available',
        StoreId: user.StoreId,
        code,
    }

    const size = await Product.findAll({
        where: data
    })

    if (size.length === 0) {
        return res.status(400).send({
            title: 'Product Not Found',
            message: 'User Barcode to find product'
        })
    }

    if (qty > size.length) {
        return res.status(400).send({
            title: 'Quantity Error',
            message: 'Quantity not enough'
        })
    } else {
        await Product.destroy(
            {
                limit: qty,
                where: data
            }
        ).then(e => {
            console.log(e)
        }).catch(error => {
            console.log(error)
        })

        const criticalStock = await CriticalStock.findOne({
            where: {
                StoreId: user.StoreId,
                productCode: code
            }
        })

        Product.count({
            where: data
        }).then(e => {
            if (e === 0) {
                CriticalStock.update({
                        status: 'Empty'
                    },
                    {
                        where: {
                            id: criticalStock.id
                        }
                    })
            } else if (e <= criticalStock.critical_level) {
                CriticalStock.update({
                        status: 'Warning'
                    },
                    {
                        where: {
                            id: criticalStock.id
                        }
                    })
            }
        })

        Insert(user.StoreId, user.id,
            'Delete Product With The Code Of ' + code + ' Quantity Of ' + req.body.qty + ' In Branch ' + user.Store.location, 0)


        res.send("Delete Success")
    }


})

router.get("/getImage/:name", (req, res) => {
    const {name} = req.params
    const pic = path.join(__dirname, '../uploads/image', name)
    res.sendFile(pic);
})

router.post("/deleteImage", verify, async (req, res) => {
    const user = req.user.user
    const {name} = req.body
    const pic = path.join(__dirname, '../uploads/image', name)


    await fs.unlink(pic, (err => {
        if (err !== null) {
            res.status(404).send({message: 'Images Not Exist'})
        } else {
            Insert(user.StoreId, user.id,
                'Delete Product Photo With The Name Of ' + name + ' In Branch ' + user.Store.location, 0)


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
    const user = req.user.user
    const {code} = req.body

    const filterData = {
        status: 'Available',
        StoreID: user.StoreId,
        code
    }

    if (user.StoreId === 0) {
        delete filterData.StoreID
    }

    const data = await Product.findAll({
        limit: 1,
        include: [
            {model: ProductType}
        ],
        where: filterData
    })

    if (data.length === 0) {
        res.status(400).send({
            title: 'Product Not Found',
            message: 'Use Barcode to find product'
        })
    } else {
        res.send(data)
    }
})

router.get('/findById', async (req, res) => {
    const {id} = req.body

    const data = await Product.findOne({
        limit: 1,
        include: [
            {model: ProductType}
        ],
        where: id
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