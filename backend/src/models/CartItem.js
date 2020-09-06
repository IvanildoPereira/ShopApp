const { Model, DataTypes} = require('sequelize');

class CartItem extends Model{
    static init(sequelize){
        super.init({
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },{
            sequelize,
            modelName: 'cart_items'
        }
        )
    }
}

module.exports = CartItem;