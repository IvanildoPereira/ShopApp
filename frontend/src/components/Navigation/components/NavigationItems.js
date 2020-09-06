import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../../context/auth-context';
import './NavigationItems.css'


export default function NavigationItems(props) {
    const auth = useContext(AuthContext);


    return (
        <ul className = "nav_link">
           <li><NavLink to = "/" onClick = {props.handleClick} exact activeStyle={{color: "#3070ce"}}>Home</NavLink></li>
           <li><NavLink to = "/products?category=All%20Products"  onClick = {props.handleClick} activeStyle={{color: "#3070ce"}}>Products</NavLink></li> 
           { auth.isLoggedIn && (<li><NavLink to = "/orders" onClick = {props.handleClick} activeStyle={{color: "#3070ce"}}>My orders</NavLink></li>) }
           <li><NavLink to = "/contact" onClick = {props.handleClick} activeStyle={{color: "#3070ce"}}>Contact</NavLink></li> 
        </ul>
    )
}
