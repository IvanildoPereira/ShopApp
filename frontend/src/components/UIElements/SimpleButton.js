import React from 'react'
import { Link } from 'react-router-dom';
import './SimpleButton.css'

export default function SimpleButton(props) {
    return (
    <Link to = {props.link} className = {props.color === "green" ? "btn btn-simple green" : "btn btn-simple white" }>{props.children}</Link>
    )
}
