import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import useFetch from '../../hooks/useFetch'
import { Card, ErrorModal, LoadingSpinner} from '../../components/index'
import './Account.css'
import cart_icon from '../../assets/account_cart.png'
import product_icon from '../../assets/account_product.png'
import order_icon from '../../assets/account_order.png'

export default function Account() {
    const [user, setUser] = useState();
    const { isLoading, error, sendRequest, clearError } = useFetch();
    const auth = useContext(AuthContext);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchUser = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND}/users/`, "GET", null, {
                    Authorization: 'Bearer ' + auth.token,
                }
                );
                console.log(responseData)
                setUser(responseData)
            } catch (err) { }
        };
        fetchUser();
    }, [sendRequest, auth.token]);

    return (
        <>
            <h1>My Account</h1>
            <Card>
                <div className="account">
                    {isLoading && <LoadingSpinner />}
                    {error && <ErrorModal error={error} onClear={clearError} />}
                    {!isLoading && user && <div className="user_account">
                        <img style = {{marginBottom: 5}} src={user.avatar_img !== null ? `${process.env.REACT_APP_BACKEND}/${user.avatar_img}` : "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_960_720.png"} alt="" />
                        <h3 style = {{marginBottom: 5}}>{user.name}</h3>
                        <p style = {{marginBottom: 5}}>{user.email}</p>
                        <Link to="/account/update-user">Edit My Perfil</Link>
                    </div>}
                    <div className="dashbord_account">
                        <div className="box_account">
                            <Link to="/account/product/" className="box_item">
                                <img src={product_icon} alt="" />
                                <p>My Products</p>
                            </Link>
                            <Link to="/cart" className="box_item">
                                <img src={cart_icon} alt="" />
                                <p>My Cart</p>
                            </Link>
                            <Link to="/orders" className="box_item">
                                <img src={order_icon} alt="" />
                                <p>My Orders</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </Card>
        </>
    )
}
