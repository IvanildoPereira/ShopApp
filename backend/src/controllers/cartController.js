const User = require('../models/User');
const Product = require('../models/Product');
const io = require('../config/socket')
const HttpError = require('../models/http-error');

const getCart = async (req, res, next) => {
    const user = await User.findByPk(req.userData.id)
    if (!user){ 
        return next(new HttpError("User doesn't exist!", 404));
    };
    const cart = await user.getCart();
    const productsCart = await cart.getProducts({
        attributes: ['cover_img', 'id', 'name', 'price'],
        joinTableAttributes: ['quantity'],
    });

    res.json({productsCart, length: productsCart.length})
}

const addToCart = async (req, res, next) => {
    const { productId, quantity } = req.body
    
    const user = await User.findByPk(req.userData.id);
    if (!user){ 
        return next(new HttpError("User doesn't exist!", 404));
    };
    const product = await Product.findByPk(productId);
    if (!product){
        return next(new HttpError("Product doesn't exist!", 404));
    }

    let products;

    const cart = await user.getCart();
    const productCart = await cart.getProducts({ where: { id: productId } });
    
    
   
    if(productCart.length > 0){
        products = productCart[0];
       
    }
    


    if (products) {
        const updateCart = await cart.addProduct(product, { through: { quantity: quantity } });
        io.getIO().in(req.userData.id).emit('cart', {action: 'update', message: 'Quantity updated'});

        return res.json(updateCart)      
    }

    const saveToCart = await cart.addProduct(product, { through: { quantity: 1 } });
    io.getIO().in(req.userData.id).emit('cart', {action: 'add', message: 'add to cart'}); 
    res.json(saveToCart)

}

const deleteProductFromCart = async (req, res, next) =>{
    const { productId } = req.params;
    const user = await User.findByPk(req.userData.id);
    if (!user){ 
        return next(new HttpError("User doesn't exist!", 404));
    };
    const cart = await user.getCart();
    const product = await cart.getProducts({where: {id: productId}})
    await product[0].cart_items.destroy();
    io.getIO().in(req.userData.id).emit('cart', {action: 'delete', message: 'delete'});
    res.json("Deleted from cart")
} 

exports.getCart = getCart;
exports.addToCart = addToCart;
exports.deleteProductFromCart = deleteProductFromCart;