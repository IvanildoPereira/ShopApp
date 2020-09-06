const { Model, DataTypes} = require('sequelize');

class OrderItem extends Model{
    static init(sequelize){
        super.init({
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },{
            sequelize,
            modelName: 'order_items'
        }
        )
    }
}

module.exports = OrderItem;