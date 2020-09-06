import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import CartItem from './components/CartItem'
import { LoadingSpinner, ErrorModal } from '../../components/index'
import useFetch from '../../hooks/useFetch'
import { AuthContext } from '../../context/auth-context';
import { CartContext } from '../../context/cart-context';



export default function Cart() {
    const { error, sendRequest, clearError } = useFetch()
    const { cart, length, loadingCart } = useContext(CartContext)
    const auth = useContext(AuthContext)
    const history = useHistory()

    const deleteFromCart = async (productID) => {
        try {
            sendRequest(`${process.env.REACT_APP_BACKEND}/cart/${productID}`, "DELETE", null, {
                Authorization: 'Bearer ' + auth.token
            });
        } catch (err) { }
    }

    const checkoutNow = async () => {
        try {
            await sendRequest(`${process.env.REACT_APP_BACKEND}/order/checkout`, "POST", null, {
                Authorization: 'Bearer ' + auth.token,
            });
            history.push('/orders')
        } catch (err) { }
    }

    const updateCart = async (productId, quantity) => {
        try {
            console.log("update: " + productId + "Quantity: " + quantity)
            const res = await sendRequest(`${process.env.REACT_APP_BACKEND}/cart/add`, "POST", JSON.stringify({ productId: productId, quantity: quantity }), {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token,
            });
            console.log(res)

        } catch (err) { }
    }

    let totalItems;

    if (cart) {
        totalItems = cart.reduce((sum, currentProduct) => {
            const { price } = currentProduct;
            const totalPrice = parseFloat(price).toFixed(2) * parseInt(currentProduct.cart_items.quantity);
            return sum + totalPrice;
        }, 0)
    }

    return (
        <>
            {loadingCart && <LoadingSpinner />}
            {error && <ErrorModal error = {error} onClear = {clearError}/>}
            {!loadingCart && <>
                <h1>Your Cart</h1>
                <h2>You have {length} Items in your cart</h2>
            </>}
            {cart && cart.map((product) =>
                <CartItem product={product} key={product.id} deleteFromCart={deleteFromCart} updateCart={updateCart} />
            )}
            {length >= 1 &&
                <div className="checkout_cart">
                    <button onClick = {() => history.push('/products')} className="shopping">
                        Continues Shopping
                    </button>
                    <button onClick = {checkoutNow} className="checkout">
                        Checkout Now
                    </button>
                    <div className="total_price">
                        <p>Sub-Total</p>
                        {totalItems && <p><span>R${totalItems.toFixed(2)}</span></p>}
                    </div>
                </div>
            }
        </>
    )
}
