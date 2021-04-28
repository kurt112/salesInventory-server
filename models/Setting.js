module.exports = (sequelize, DataTypes) => {
    const Setting = sequelize.define("Setting", {
        critical_stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        }

});


    return Setting
}