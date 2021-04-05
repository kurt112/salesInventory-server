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


const {User, Supplier, Product, Store, Customer,Sales,Transaction}  = require('./models')


// route implementation
app.use('/product', ProductRoute)
app.use('/user', UserRoute)
app.use('/transaction', TransactionRoute)
app.use('/supplier', SupplierRoute)
app.use('./store', StoreRoute)
app.use('./sales', SalesRoute)
app.use('./customer',CustomerRoute)



app.get('/select', (req, res) => {
    User.findAll({
        where: {firstName: "John"}
    }).then((user) => {
        res.send(user)
    }).catch((error) => {
        console.log(error);
    })

})


app.get('/insert', (req, res) => {
    User.create({
        firstName: "Pedre",
        age: 19,
    }).catch(err => {
        if(err){
            console.log(err);
        }
    })

    res.send(User)
})

app.get('/delete', (req, res) => {
    User.destroy({where: {id: 1}})
    res.send('delete')
})

db.sequelize.sync().then((req) => {
    app.listen(3001, () => {
        console.log("Server running");
    })
})
