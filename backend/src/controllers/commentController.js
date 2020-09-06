const Comment = require("../models/Comment");
const User = require("../models/User");
const HttpError = require('../models/http-error');

const postComment = async (req, res, next) => {
  const { productId, body } = req.body;
  const user = await User.findByPk(req.userData.id);
  if (!user) {
    return next(new HttpError("User doesn't exist!", 404));
  }
  try {
    const comment = Comment.create({
      user_id: user.id,
      product_id: productId,
      body,
    });
    res.json({message: "Thank's for your Comment!"});
  } catch (err) {
    const error = new HttpError("It wasn't possible save the comment!", 500);
    return next(error)
  }
};

exports.postComment = postComment;
