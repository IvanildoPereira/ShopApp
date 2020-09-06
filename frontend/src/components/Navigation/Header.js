import React from 'react'
import NavigationAccount from './components/NavigationAccount'
import Navigation from './components/Navigation'
import './Header.css'

export default function Header() {
    return (
        <header>
            <div className="container">
                <div className="header-flex">
                    <div className="logo">
                        Shop<span>App</span>
                    </div>
                    <Navigation />
                    <NavigationAccount />
                </div>
            </div>
        </header>
    )
}
