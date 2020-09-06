const { Model, DataTypes} = require('sequelize');

class Product extends Model{
    static init(sequelize){
        super.init({
            cover_img: DataTypes.STRING,
            second_img: DataTypes.STRING,
            third_img: DataTypes.STRING,
            name: DataTypes.STRING,
            price: DataTypes.DOUBLE,
            categories: DataTypes.STRING,
            details: DataTypes.TEXT,
        },{
            sequelize
        }
        )
    }
    static associate(models){
        this.belongsTo(models.User, {foreignKey: 'user_id', as: 'user'});
        this.belongsToMany(models.Cart, {through: 'cart_items'});
        this.belongsToMany(models.Order, {through: 'order_items', as: 'order'});
        this.hasMany(models.Comment, {foreignKey: 'product_id'})
        
    }
}

module.exports = Product;