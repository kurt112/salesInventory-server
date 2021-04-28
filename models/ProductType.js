module.exports = (sequelize, DataTypes) => {
    const productType = sequelize.define("ProductType", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            }
        },
    });

    productType.associate = models  => {
        productType.hasMany(models.Product, {
            onDelete: 'cascade'
        })
    }


    return productType
}