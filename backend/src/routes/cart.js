const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const cartController = require('../controllers/cartController');


//Add to cart
router.get('/', checkAuth , cartController.getCart)

//Add to cart
router.post('/add', checkAuth , cartController.addToCart);

//delete a product from cart
router.delete('/:productId', checkAuth , cartController.deleteProductFromCart)

module.exports = router
