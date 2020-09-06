const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const fileUpload = require('../middleware/file-Upload')
const productsController = require('../controllers/productsController');

//Get all products router
router.get('/', productsController.getProducts);

//Get owner products
router.get('/owner/:userId/', productsController.getProducts);

//Get single product
router.get('/:id', productsController.getProduct);

//Create products router
router.post('/create', checkAuth, fileUpload.any(), productsController.createProduct);

// update
router.post('/edit/:productId', checkAuth, productsController.updateProduct);

router.delete('/delete/:productId', checkAuth, productsController.deleteProduct);


module.exports = router;