const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const orderController = require('../controllers/orderController');


//Get orders
router.get('/', checkAuth , orderController.getOrders);
//Add order
router.post('/checkout', checkAuth , orderController.postOrder);

router.get('/invoice/:orderId', checkAuth, orderController.generateInvoice);



module.exports = router;