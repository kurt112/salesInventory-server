module.exports = (sequelize, DataTypes) => {
    const AuditTrail = sequelize.define("AuditTrail", {
        action: {
            type:DataTypes.STRING,
        },
        value: {
            type: DataTypes.INTEGER
        }
    });


    AuditTrail.associate= models => {
        AuditTrail.belongsTo(models.User, {
            onDelete: 'cascade'
        })
        AuditTrail.belongsTo(models.Store, {
            onDelete: 'cascade'
        })
    }

    return AuditTrail
}