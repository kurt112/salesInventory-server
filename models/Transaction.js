module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define("Transaction", {

        amount: {
            type:DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        discount: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        deletedAt: {
            type: DataTypes.DATE,

        }
    });


    Transaction.associate= models => {

        Transaction.hasMany(models.Sales, {
            onDelete: 'cascade'
        })

        Transaction.belongsTo(models.Store,{
            foreignKey:{
                allowNull: false
            }
        })

        Transaction.belongsTo(models.User,{
            foreignKey:{
                allowNull: false
            }
        })

        Transaction.belongsTo(models.Customer,{
            foreignKey:{
                allowNull: false
            }
        })

    }

    return Transaction
}