module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("Product", {
        brand: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Active'
        },
        deletedAt: {
            type: DataTypes.DATE,
        }
    })

    Product.associate = models => {
        Product.hasMany(models.Sales, {
            onDelete: 'cascade'
        })
    }

    return Product
}