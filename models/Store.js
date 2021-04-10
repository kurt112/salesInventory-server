module.exports = (sequelize, DataTypes) => {
    const Store = sequelize.define("Store", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true,
            },
            unique: {
                msg: 'Email Already Exist'
            }
        },
        address: {
            type: DataTypes.STRING
        },
        city: {
            type: DataTypes.STRING
        },
        state: {
            type: DataTypes.STRING
        },
        postalCode: {
            type: DataTypes.INTEGER
        },
        mobile_no: {
            type: DataTypes.STRING
        },
        tel_no: {
            type: DataTypes.STRING
        },
        deletedAt: {
            type: DataTypes.DATE
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
    }


    return Store
}