module.exports = (sequelize, DataTypes) => {    
    const User = sequelize.define("User", {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
            unique: {
                msg: 'Email address already in use!'
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        role: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        deletedAt: {
            type: DataTypes.DATE,
        }
    })

    User.associate = models => {
        User.hasMany(models.Transaction, {
            onDelete: 'cascade'
        })

        User.belongsTo(models.Store,{
            foreignKey:{
                allowNull: false
            }
        })
    }




    return User
}


