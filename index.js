const express = require("express")
const app = express()
const db = require('./models')

// Routes For Server
const ProductRoute = require("./routes/ProductRoute")
const CustomerRoute = require("./routes/CustomerRoute")
const SalesRoute = require("./routes/SalesRoute")
const StoreRoute = require("./routes/StoreRoute")
const SupplierRoute = require("./routes/SupplierRoute")
const TransactionRoute = require("./routes/TransactionRoute")
const UserRoute = require("./routes/UserRoute")



// route implementation
app.use('/product', ProductRoute)
app.use('/user', UserRoute)
app.use('/transaction', TransactionRoute)
app.use('/supplier', SupplierRoute)
app.use('/store', StoreRoute)
app.use('/sales', SalesRoute)
app.use('/customer', CustomerRoute)








db.sequelize.sync().then((req) => {
    app.listen(3001, () => {
        console.log("Server running");
    })
})
