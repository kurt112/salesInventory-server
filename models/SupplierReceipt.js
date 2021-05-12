module.exports = (sequelize, DataTypes) => {
    const SupplierReceipt = sequelize.define("SupplierReceipt", {
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        image: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true,
            },
            unique: {
                msg: 'Email address already in use!'
            }
        }



    });

    SupplierReceipt.associate = models => {
        SupplierReceipt.belongsTo(models.Supplier, {
            foreignKey: {
                allowNull: false
            }
        })

        SupplierReceipt.belongsTo(models.Store, {
            foreignKey: {
                allowNull: false
            }
        })
    }

    return SupplierReceipt
}