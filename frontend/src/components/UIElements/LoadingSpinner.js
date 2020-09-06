import React from 'react'
import './LoadingSpinner.css'

export default function LoadingSpinner() {
    return (
        <div className="center">
            <div className="spinner">
                <div className="rect1"></div>
                <div className="rect2"></div>
                <div className="rect3"></div>
                <div className="rect4"></div>
                <div className="rect5"></div>
            </div>
        </div>
    )
}
