const { Model, DataTypes} = require('sequelize');

class User extends Model{
    static init(sequelize){
        super.init({
            avatar_img: DataTypes.STRING,
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            passwordResetToken: DataTypes.STRING,
            passwordResetExpires: DataTypes.DATE
        },{
            sequelize
        }
        )
        
    }
    static associate(models){
        this.hasOne(models.Cart, {foreignKey: 'user_id'});
        this.hasMany(models.Order, {foreignKey: 'user_id'})
        this.hasMany(models.Comment, {foreignKey: 'user_id'})
    }
}

module.exports = User;