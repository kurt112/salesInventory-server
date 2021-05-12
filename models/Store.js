module.exports = (sequelize, DataTypes) => {
    const Store = sequelize.define("Store", {
        code: {
            type: DataTypes.STRING
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            unique: {
                msg: 'Email Already Exist'
            }
        },
        requesting:{
            type:DataTypes.INTEGER,
            defaultValue: 0
        },
        postalCode: {
            type: DataTypes.INTEGER
        },
        mobile_no: {
            type: DataTypes.STRING
        },
        tel_no: {
            type: DataTypes.STRING
        }
    });

    Store.associate = models => {

        Store.hasMany(models.Transaction, {
            onDelete: 'cascade'
        })

        Store.hasMany(models.Product, {
            onDelete: 'cascade'
        })

        Store.hasMany(models.SupplierReceipt, {
            onDelete: 'cascade'
        })

        Store.hasMany(models.User, {
            onDelete: 'cascade'
        })

        Store.hasMany(models.AuditTrail, {
            onDelete: 'cascade'
        })

        Store.hasMany(models.TransferProduct, {

            onDelete:'cascade',
            foreignKey:{
                name:'To'
            }

        })
        Store.hasMany(models.TransferProduct, {

            onDelete:'cascade',
            foreignKey: {
                name:'From'
            }
        })

        Store.hasMany(models.Sales, {
            onDelete: 'cascade'
        })

    }


    return Store
}