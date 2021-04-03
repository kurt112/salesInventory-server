const express = require("express")
const app = express()
const db = require('./models')
const product = require("./routes/prouct")
const {User, Product}  = require('./models')

app.use('/product', product)
// route for product


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
