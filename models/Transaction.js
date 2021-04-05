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
    }

    return Transaction
}