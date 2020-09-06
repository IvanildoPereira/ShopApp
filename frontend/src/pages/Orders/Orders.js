import React, { useState, useEffect, useContext } from 'react'
import { format } from 'date-fns'
import './Orders.css'
import { Card, LoadingSpinner, ErrorModal, SuccessModal } from '../../components/index'
import useFetch from '../../hooks/useFetch'
import { AuthContext } from '../../context/auth-context'
import OrdersItems from './components/OrdersItems';
import arrowDawn from '../../assets/arrow_dawn.svg'

export default function Orders() {
    const auth = useContext(AuthContext);
    const { sendRequest, isLoading, error, clearError } = useFetch()
    const [active, setActive] = useState({});
    const [orders, setOrders] = useState(null);
    const [success, setSuccess] = useState()

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await sendRequest(`${process.env.REACT_APP_BACKEND}/order/`, "GET", null, {
                Authorization: 'bearer ' + auth.token
            })
            console.log(response);
            setOrders(response);
        }
        fetchOrders();
    }, [sendRequest, auth.token])

    const toogleAccordion = (id) => {
        setActive({...active, [id]:  !active[id] })
    }

    const clearSuccess = () =>{
        setSuccess(null);
      }

    const getInvoice = async (id) =>{
        const response = await sendRequest(`${process.env.REACT_APP_BACKEND}/order/invoice/${id}`, "GET", null, {
            Authorization: 'bearer ' + auth.token
        })

        setSuccess(response.message);
    }

    const getTotalOrder = (order) =>{
        const total = order.products.reduce((sum, currentProduct) => {
            const { price } = currentProduct;
            const totalPrice = parseFloat(price).toFixed(2) * parseInt(currentProduct.order_items.quantity);
            return sum + totalPrice;
        }, 0)
        return total
    }

    return (
        <div>
            <h1>Orders</h1>
            <div className="orders_grid">
                {isLoading && <LoadingSpinner />}
                {error && <ErrorModal error = {error} onClear = {clearError}/>}
                {success && <SuccessModal success = {success} onRedirect = {clearSuccess}/>}
                {!isLoading && orders && orders.map((order, index) => (
                    <Card key = {index}>
                        <button className = "accordeon_order" onClick={() => toogleAccordion(order.id)}>
                        <div className= "order_header">
                            <div className="order_id">
                                Order: {order.id}
                            </div>
                            <div className="order_date">
                                Date: {format(new Date(order.createdAt), 'E yy MMM dd')}
                                <img src = {arrowDawn} alt = "arrow open"/>
                            </div>
                        </div>
                        </button>
                        <div className="line"></div>
                        {order.products.map(product => (
                            <>
                                <OrdersItems  key = {product.id} product={product} active = {active[order.id]} />
                            </>
                        ))}
                        <div className="order_footer">
                        <div className="order_price">Total: <span>R$ {getTotalOrder(order).toFixed(2)}</span></div>
                            <button className="order_invoice" onClick = {() => getInvoice(order.id)}>Get Invoice</button>
                        </div>
                    </Card>

                ))}
            </div>
        </div>
    )
}