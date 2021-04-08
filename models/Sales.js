module.exports = (sequelize, DataTypes) => {
    const Sales = sequelize.define("Sales", {
        qty: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        total: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        deleteAt: {
            type: DataTypes.DATE,
        }

    });

    Sales.associate = models  => {
        Sales.belongsTo(models.Transaction, {
            foreignKey: {
                allowNull: false
            }
        })

        Sales.belongsTo(models.Product, {
            foreignKey: {
                allowNull: false
            }
        })

    }


    return Sales
}