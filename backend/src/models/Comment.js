const { Model, DataTypes} = require('sequelize');

class Comment extends Model{
    static init(sequelize){
        super.init({
            body: DataTypes.TEXT,
        },{
            sequelize
        }
        )
    }
    static associate(models){
        this.belongsTo(models.User, {foreignKey: 'user_id', as: "user"});
        this.belongsTo(models.Product, {foreignKey: 'product_id', as: "product"})
    }
}

module.exports = Comment;