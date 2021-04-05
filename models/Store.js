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
            type:DataTypes.STRING,
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
        Store.hasMany(models.User, {
            onDelete: 'cascade'
        })
    }


    Store.associate = models => {
        Store.hasMany(models.Transaction, {
            onDelete: 'cascade'
        })
    }

    Store.associate = models => {
        Store.hasMany(models.Product, {
            onDelete: 'cascade'
        })
    }



    return Store
}