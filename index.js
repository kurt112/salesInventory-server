const express = require("express")
const db = require('./models')
const cors = require('cors')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
const app = express()
const verify = require('./utils/jwt')
const {User, Store,Customer,Setting} = require('./models')
const PORT = process.env.PORT || 3001;
// setting up cors
app.use(cors(
    {
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        origin: 'http://localhost:3000',
    }
))

app.use(bodyParser.json());
app.use(fileUpload());

// Routes For Server
const ProductRoute = require("./routes/ProductRoute")
const CustomerRoute = require("./routes/CustomerRoute")
const SalesRoute = require("./routes/SalesRoute")
const StoreRoute = require("./routes/StoreRoute")
const SupplierRoute = require("./routes/SupplierRoute")
const TransactionRoute = require("./routes/TransactionRoute")
const UserRoute = require("./routes/UserRoute")
const AuditTrailRoute = require('./routes/AuditTrail')
const DashBoardRoute = require('./routes/DashBoardRoute')
const Auth = require('./routes/Authentication')
const Settings = require('./routes/SettingsRoute')
const Transfer = require('./routes/TransferRoute')

// route implementation
app.use('/product', ProductRoute)
app.use('/user', verify, UserRoute)
app.use('/transaction', verify, TransactionRoute)
app.use('/supplier', verify, SupplierRoute)
app.use('/store', verify, StoreRoute)
app.use('/sales', verify, SalesRoute)
app.use('/customer', verify, CustomerRoute)
app.use('/audit', verify, AuditTrailRoute)
app.use('/dashboard', verify, DashBoardRoute)
app.use('/setting', verify, Settings)
app.use('/transfer', verify, Transfer)
app.use('/', Auth)

app.post('/upload', async (req, res) => {

    if (req.files === null) {
        return res.status(400).json({msg: 'No file Uploaded'})
    }

    const file = req.files.picture

    file.mv(`${__dirname}/uploads/image/${file.name}`, err => {
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        }
    })


    res.send(`Hello World`)
})



db.sequelize.sync().then(() => {
    app.listen(PORT, async () => {
        console.log("i am listening ")
        const customer = await Customer.findOne({
            where: {id: 1}
        })

        if(!customer){
            try{
                await Customer.create({
                    name: 'Hidden',
                    email: 'Hidden@email.com',
                    address: 'Hidden',
                    city: 'Hidden',
                    postalCode: 1,
                    mobile_no: 'Hidden',
                    tel_no: 'Hidden'

                })
            }catch(error) {
                console.log(error)
            }
        }

        const store = await Store.findOne({
            where: {id: 1}
        })

        if (!store) {
            try {
                await Store.create({
                    code: 'jard-main-location',
                    location: 'San Pablo',
                    email: 'owner@gmail.com',
                    postalCode: '1850',
                    mobile_no: '0515152',
                    tel_no: '921933'
                })
            } catch (ignored) {
                console.log("Store Already Exist")
            }
        }


        const user = await User.findOne({
            where: {id: 1}
        })

        if (!user) {
            try {
                await User.create({
                    email: 'owner',
                    password: 'jars',
                    firstName: 'owner',
                    lastName: 'lastName',
                    role: 3,
                    status: 1,
                    StoreId: 1,
                })
            } catch (ignored) {
                console.log("User Already exist")
            }
        }


        const data = {
            critical_stock: 1,
        }

        let stock = await Setting.findOne({
            where: {id: 1}
        })

        if (stock === null) {
             await Setting.create(data).catch(error => {
                console.log(error)
            })
        }
    })
})


