const { Model } = require('sequelize');

class Order extends Model{
    static init(sequelize){
        super.init({},{sequelize})
    }
    static associate(models){
        this.belongsTo(models.User, {foreignKey: 'user_id', as: 'user'});
        this.belongsToMany(models.Product, {through: 'order_items', as: 'products'})
    }
}

module.exports = Order;