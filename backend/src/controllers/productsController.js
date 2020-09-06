const Product = require("../models/Product");
const User = require("../models/User");
const Comment = require("../models/Comment");
const HttpError = require("../models/http-error");
const { Op } = require("sequelize");

const getProducts = async (req, res, next) => {
  const { page, perPage, category, sort, search } = req.query;
  const userId = req.params.userId;
  const pg = (page - 1) * perPage;

  let options = {
    attributes: ["id", "cover_img", "name", "price", "details", "categories"],
    offset: pg,
    limit: parseInt(perPage),
    where: {},
    order: [],
  };

  if (userId) {
    options.where.user_id = userId;
  }

  if (search) {
    options.where.name = { [Op.like]: "%" + search + "%" };
  }

  if (category && category !== "All Products") {
    options.where.categories = category;
  }

  switch (sort) {
    case "recently":
      options.order.push(["createdAt", "DESC"]);
      break;
    case "name":
      options.order.push(["name", "ASC"]);
      break;
    case "price":
      options.order.push(["price", "ASC"]);
      break;
    default:
      options.order.push(["createdAt", "DESC"]);
  }

  try {
    const { count, rows: products } = await Product.findAndCountAll(options);
    res.json({ products, total: count, lastPage: Math.ceil(count / perPage) });
  } catch (err) {
    const error =  new HttpError("Can't load the Products!", 500);
    return next(error);

  }
};

const getProduct = async (req, res, next) => {
  const { id } = req.params;
  
  const product = await Product.findByPk(id);
  const comments = await Comment.findAll({
    where: { product_id: id },
    include: [{ association: "user", attributes: ["avatar_img","name"] }],
  });
  if (!product) return res.json("Não há produtos");
  res.json({ product, comments });
};

const createProduct = async (req, res, next) => {
  const { name, category, price, details } = req.body;
  
  const user = await User.findByPk(req.userData.id);
  if (!user) return res.status(404).json({ Message: "User doesn't exist!" });

  try {
    const product = await Product.create({
      cover_img: req.files[0].path,
      second_img: req.files[1] === undefined ? null : req.files[1].path,
      third_img: req.files[2] === undefined ? null : req.files[2].path,
      name,
      categories: category,
      price,
      details,
      user_id: req.userData.id,
    });
    res.json({ message: "Created with Success!", product });
  } catch (err) {
    const error =  new HttpError("It wasn't possible save the new product!", 500);
    return next(error);
  }
};

const updateProduct = async (req, res, next) => {
  const productId = req.params.productId;
  const { name, category, price, details } = req.body;
  
  const user = await User.findByPk(req.userData.id);
  if (!user) return res.status(404).json({ Message: "User doesn't exist!" });
  try {
    const product = await Product.findByPk(productId);
    if (product.user_id === user.id) {
      await product.update({
        name,
        categories: category,
        price,
        details
      });
      res.json({ message: "Updated with Success!", product });
    } else {
      return next(new HttpError("You're not allowed to delete this product!", 403));
    }
  } catch (err) {
    const error = HttpError("It wasn't possible save the new product!");
    return next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  const productId = req.params.productId;
  const user = await User.findByPk(req.userData.id);
  if (!user) return res.status(404).json({ Message: "User doesn't exist!" });
  try {
    const product = await Product.findByPk(productId);
    if (product.user_id === user.id) {
      await product.destroy();
      res.json({ message: 'Product deleted with success!' });
    } else {
      return next(new HttpError("You're not allowed to delete this product!", 403));
    }
  } catch (err) {
    const error = new HttpError("Can't delete the product, probably there are orders with this product! ", 500);
    return next(error);
  }
}

exports.getProducts = getProducts;
exports.getProduct = getProduct;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;