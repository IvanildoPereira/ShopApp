import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../../context/auth-context';
import { CartContext } from '../../../context/cart-context'
import './NavigationAccount.css'
import cartItem from '../../../assets/ant-design_shopping-cart-outlined.png'
import userAccount from '../../../assets/jam_user-circle.png'
import logoutIcon from '../../../assets/mdi-light_logout.png'
import userAdd from '../../../assets/user-add.png'

export default function NavigationAccount() {

    const auth = useContext(AuthContext);
    const cart = useContext(CartContext);

    let iconsLink;

    if (auth.isLoggedIn) {
        iconsLink = (
            <>
                <NavLink to="/account" exact>
                    <div className="nav_icon">
                        <img alt="" src={userAccount} />
                        <span>My account</span>
                    </div>
                </NavLink>
                <NavLink to="/cart">
                    <div className="nav_icon cart_qt">
                        <img alt="" src={cartItem} />
                        <span>My cart</span>
                        <div className="cartQt">{cart.length}</div>
                    </div>
                </NavLink>

                <div className="nav_icon" onClick={() => auth.logout(auth.socket, auth.userId)}>
                    <img alt="" src={logoutIcon} />
                    <span>Logout</span>
                </div>

            </>
        )
    } else {
        iconsLink = (
            <>
                <NavLink to="/login">
                    <div className="nav_icon">
                        <img alt="" src={userAccount} />
                        <span>Login</span>
                    </div>
                </NavLink>
                <NavLink to="/register">
                    <div className="nav_icon">
                        <img alt="" src={userAdd} />
                        <span>Register</span>
                    </div>
                </NavLink>
            </>
        )
    }

    return (
        <div className="nav_account">
            {iconsLink}
        </div >
    )
}
