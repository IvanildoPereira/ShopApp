const User = require("../models/User");
const Order = require("../models/Order")
const io = require("../config/socket");
const HttpError = require("../models/http-error");
const Queue = require('../lib/Queue');


const postOrder = async (req, res, next) => {
  const user = await User.findByPk(req.userData.id);
  if (!user) return res.status(404).json({ Message: "User doesn't exist!" });
  const getCart = await user.getCart();
  const products = await getCart.getProducts();
  if (products.length === 0) {
    return res.json("There are not products in the cart!");
  }
  try {
    const order = await user.createOrder();
    const savedProductsOrder = await order.addProducts(
      products.map((product) => {
        product.order_items = { quantity: product.cart_items.quantity };
        return product;
      })
    );
    await getCart.setProducts(null);
    io.getIO()
      .in(req.userData.id)
      .emit("cart", { action: "checkout", message: "Cart voided" });
    res.json(savedProductsOrder);
  } catch (err) {
    const error = new HttpError("Something goes wrong!", 500);
    return next(error)
  }
};

const getOrders = async (req, res, next) => {
  const user = await User.findByPk(req.userData.id);
  if (!user) {
    return next(new HttpError("User doesn't exist!", 404));
  }
  try {
    const orders = await user.getOrders({
      include: {
        association: "products",
        attributes: ["cover_img", "id", "name", "price"],
        through: { attributes: ["quantity"] },
      },
    });
    res.json(orders);
  } catch (err) {
    const error = new HttpError("Something goes wrong!", 500);
    return next(error)
  }
};

const generateInvoice = async (req, res, next) => {
  const orderId = req.params.orderId;
  const user = await User.findByPk(req.userData.id)
  if (!user) return res.status(404).json({ Message: "User doesn't exist!" });

  const order = await Order.findOne({where:{id: orderId, user_id: user.id}})
  const products = await order.getProducts({
      attributes: ['id', 'name', 'price'],
      joinTableAttributes: ['quantity'],
  });    
  
  Queue.add('InvoiceMail', { user, order, products });
  res.json({message: "The invoice will be send to your email after processing ..."})
}

exports.generateInvoice = generateInvoice;
exports.postOrder = postOrder;
exports.getOrders = getOrders;
