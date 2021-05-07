module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("Product", {
        brand: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        code: {
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
        photo: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        deletedAt: {
            type: DataTypes.DATE,
        }
    })

    Product.associate = models => {
        Product.hasMany(models.Sales, {
            onDelete: 'cascade'
        })

        Product.belongsTo(models.ProductType, {
            foreignKey: {
                allowNull: false
            }
        })

        Product.belongsTo(models.Supplier, {
            foreignKey: {
                allowNull: false
            }
        })

        Product.belongsTo(models.Store, {
            foreignKey: {
                allowNull: false
            }
        })
    }

    return Product
}