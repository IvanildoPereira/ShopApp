const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Comment = require('../models/Comment')

const connection = new Sequelize(dbConfig);

User.init(connection);
Product.init(connection);
Cart.init(connection);
CartItem.init(connection);
Order.init(connection);
OrderItem.init(connection);
Comment.init(connection);

User.associate(connection.models);
Cart.associate(connection.models);
Product.associate(connection.models);
Order.associate(connection.models);
Comment.associate(connection.models)


module.exports = connection;