const express = require('express')
let router = express.Router()


router.get('/', (req, res) => {
    res.send("wew")
})

module.exports = router