import React,{ useContext } from 'react'
import { AuthContext } from '../../../../context/auth-context'
import { CartContext } from '../../../../context/cart-context'

import { ButtonAddCart, SimpleButton } from "../../../../components/index";

import parse from 'html-react-parser';
import '../ProductView.css'

export default function ProductInfo({product, sendRequest}) {
    const auth = useContext(AuthContext);
    const {cart} = useContext(CartContext);

    let inCart;

    if(cart){
        inCart = cart.some(el => product.id === el.id)
    }

    const addToCart = async (productId) => {
        try {
            console.log("add to cart")
            await sendRequest(`${process.env.REACT_APP_BACKEND}/cart/add`, "POST", JSON.stringify({ productId: productId }), {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token,
            });
            

        } catch (err) { }
    }

    return (
        <div className="product-info">
            <div className="product-gruop">
                <h2 style = {{marginLeft: 0}}>{product.name}</h2>
                <p style={{ marginTop: 10, color: '#2D9F11' }}>R$ {product.price.toFixed(2)}</p>
                <div className = "product_content" style={{ marginTop: 10, fontSize: 15 }}>{parse(product.details)}</div>
                <div className="button-group">
                    {auth.isLoggedIn && !inCart && <ButtonAddCart onClick = {()=> addToCart(product.id)}/>}
                    {auth.isLoggedIn && inCart && <SimpleButton color = "green" link={'/cart'}>See Cart</SimpleButton>}
                    <SimpleButton color = "white" link={'/products'}>See Others Products</SimpleButton>
                </div>
            </div>
        </div>
    )
}
