import React from 'react'
import './OrdersItems.css'

export default function OrdersItems({ product, active }) {
    return (
        <div className="accordion_order" style={{ maxHeight: active === true ?  "max-content" : "0px" }}>
            <div className="product_order">
                <img src={`${process.env.REACT_APP_BACKEND}/${product.cover_img}`} alt = ""/>
                <div className="order_info">
                    <div>
                        <p className="name">{product.name}</p>
                        <p className="id">ID:{product.id}</p>
                        <p className="quantity">Qtd:{product.order_items.quantity}</p>
                    </div>
                    <div className="product_price">
                        <p>R${product.price.toFixed(2)}</p>
                    </div>
                </div>

            </div>
            <div className="line"></div>
        </div>
    )
}
