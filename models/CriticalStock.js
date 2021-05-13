module.exports = (sequelize, DataTypes) => {
    const CriticalStock = sequelize.define("CriticalStock", {
        critical_level: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
            defaultValue: 1
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        productCode: {
            type: DataTypes.STRING,
            allowNull: false
        }

    });

    CriticalStock.associate= models => {
        CriticalStock.belongsTo(models.Store, {
            foreignKey: {
                allowNull: false
            }
        })
    }


    return CriticalStock
}