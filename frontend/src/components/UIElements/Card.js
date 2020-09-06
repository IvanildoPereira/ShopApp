import React from 'react'
import './Card.css'

export default function card(props) {
    return (
        <div className = "card">
            {props.children}
        </div>
    )
}
