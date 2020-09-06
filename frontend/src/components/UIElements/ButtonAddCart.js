import React from 'react'
import addcart from '../../assets/add-cart.png'
import './ButtonAddCart.css'

export default function ButtonAddCart(props) {
    return (
        <button className = "btn-addCart" onClick={props.onClick}><img src = {addcart} alt = ""/><span>Add to cart</span></button>
    )
}
