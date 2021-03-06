const { Model } = require('sequelize');

class Cart extends Model{
    static init(sequelize){
        super.init({},{sequelize})
    }
    static associate(models){
        this.belongsTo(models.User, {foreignKey: 'user_id', as: 'user'});
        this.belongsToMany(models.Product, {through: 'cart_items'})
    }
}

module.exports = Cart;