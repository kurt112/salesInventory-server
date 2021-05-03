module.exports = (sequelize, DataTypes) => {
    const TransferProduct = sequelize.define('TransferProduct', {

        code:{
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.STRING
        }
    });


    TransferProduct.associate = models => {

        TransferProduct.belongsTo(models.User,{
            as:'arrangeBy',
            foreignKey: 'ArrangeBy'
        })

        TransferProduct.belongsTo(models.Store,{
            as:'to',
            foreignKey:'To'
        })


        TransferProduct.belongsTo(models.Store,{
            as:'from',
            foreignKey:{
                name: 'From'
            }
        })

        TransferProduct.belongsTo(models.Product,{
            foreignKey: "ProductId"
        })


    }

    return TransferProduct
}