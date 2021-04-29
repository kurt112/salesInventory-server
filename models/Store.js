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


        Store.hasMany(models.User, {
            onDelete: 'cascade'
        })

        Store.hasMany(models.AuditTrail, {
            onDelete: 'cascade'
        })
    }


    return Store
}