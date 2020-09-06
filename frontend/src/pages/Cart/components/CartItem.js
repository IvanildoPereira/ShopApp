import React from 'react'
import '../Cart.css'
import plus from '../../../assets/plus.png'
import minus from '../../../assets/minus.png'
import { Card } from '../../../components/index'
import removeCicle from '../../../assets/remove-circle.png'

export default function CartItem({ product, deleteFromCart, updateCart }) {    

    return (
        <Card key={product.id}>
            <div className="cart-flex">
                <div className="img-cart"><img src={`${process.env.REACT_APP_BACKEND}/${product.cover_img}`} alt="" /></div>
                <div className="flex-mobile">
                    <div className="info-cart">
                        <div><p className="title-product">{product.name}</p></div>
                        <div><p className="id-product">ID: {product.id}</p></div>
                    </div>
                    <div className="flex-mobile-2">
                        <div className="quantity-product">
                            {product.cart_items.quantity > 1 && <button className={product.cart_items.quantity > 1 ? 'minus-btn' : 'none'} type="button" name="button" onClick = {() => {updateCart(product.id, product.cart_items.quantity - 1)}}>
                                <img src={minus} alt="" />
                            </button>}
                            <input type="text" name="name" value={product.cart_items.quantity} readOnly />
                            <button className="plus-btn" type="button" name="button" onClick = {() => {updateCart(product.id, product.cart_items.quantity + 1)}}>
                                <img src={plus} alt="" />
                            </button>
                        </div>
                        <div className="price-unity"><p>R$ {product.price.toFixed(2)}</p></div>
                    </div>
                </div>
                <div className="teste"><button className="remove-circle" onClick = {() => {deleteFromCart(product.id)}}><img src={removeCicle} alt="" /></button></div>
            </div>

        </Card>
    )
}
