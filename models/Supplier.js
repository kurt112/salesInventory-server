module.exports = (sequelize, DataTypes) => {
    const Supplier = sequelize.define("Supplier", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true,

            },
            unique: {
                msg: 'Email address already in use!'
            }
        },
        contactPerson: {
          type: DataTypes.STRING,
          validate: {
              notEmpty: true
          }
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
        },

        deletedAt: {
            type: DataTypes.DATE
        }
    });

    Supplier.associate = models => {
        Supplier.hasMany(models.Product, {
            onDelete: 'cascade'
        })

        Supplier.hasMany(models.SupplierReceipt, {
            onDelete: 'cascade'
        })
    }


    return Supplier
}