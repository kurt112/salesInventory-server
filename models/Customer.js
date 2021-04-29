module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define("Customer", {
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
        postalCode: {
            type: DataTypes.INTEGER
        },
        mobile_no: {
            type: DataTypes.STRING
        },
        tel_no: {
            type: DataTypes.STRING
        }
    });


    Customer.associate= models => {
        Customer.hasMany(models.Transaction, {
            onDelete: 'cascade'
        })
    }

    return Customer
}