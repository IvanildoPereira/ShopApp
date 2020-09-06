import React, { useContext } from 'react'
import htmlToText from 'html-to-text';
import './ProductsGrid.css'
import { AuthContext } from '../../../../context/auth-context';
import { Card, ErrorModal, ButtonAddCart, SimpleButton } from '../../../../components/index'
import { CartContext } from '../../../../context/cart-context';
import useFetch from '../../../../hooks/useFetch'

export default function ProductsGrid({ product }) {
    const auth = useContext(AuthContext);
    const { error, sendRequest, clearError } = useFetch()
    const { cart } = useContext(CartContext);
    let inCart;

    if (cart) {
        inCart = cart.some(el => product.id === el.id)
    }

    const addToCart = async (productId) => {
        try {
            await sendRequest(`${process.env.REACT_APP_BACKEND}/cart/add`, "POST", JSON.stringify({ productId: productId }), {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token,
            });


        } catch (err) { }
    }

    return (
      <>
        {error && <ErrorModal error = {error} onClear = {clearError}/>}
        <Card key={product.name}>
            <div className="product-img">
                <img src={`${process.env.REACT_APP_BACKEND}/${product.cover_img}`}  alt = "cover product"/>
            </div>
            <div className="product-card">
                <div className="product-name"><p>{product.name}</p></div>
                <p><strong style = {{fontSize: 12}}>Price: </strong><span className="product-price"> R$ {product.price.toFixed(2)}</span></p>
                <p className="product-details"><span>{htmlToText.fromString(product.details).slice(0, 50)} ...</span></p>
            </div>
            <div className="button-group">
                {auth.isLoggedIn && inCart && <SimpleButton color = "green" link={'/cart'}>CheckOut</SimpleButton>}
                <SimpleButton color = "white" link={`/product/${product.id}`}>See more</SimpleButton>
                {auth.isLoggedIn && !inCart && <ButtonAddCart onClick={() => addToCart(product.id)} />}
            </div>
        </Card>
      </>
    )
}
