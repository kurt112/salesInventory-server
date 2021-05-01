module.exports = (sequelize) => {
    const Sales = sequelize.define("Sales", {

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