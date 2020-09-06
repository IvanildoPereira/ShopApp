import React, {useState} from 'react'
import NavigationItems from './NavigationItems'
import hamburguerIcon from '../../../assets/hamburguer.png' 

import './Navigation.css'

export default function Navigation() {
    const [activeMenu, setActiveMenu] = useState(false);

    const handleClickMenu = () => {
        setActiveMenu(!activeMenu);
    }

    return (
        <>
            <div className="menu-toggle" onClick = {handleClickMenu}><img src = {hamburguerIcon} alt = ""/></div>
            <nav className = {activeMenu === true ? 'active' : ''}>
                <NavigationItems handleClick = {handleClickMenu}/>
            </nav>
        </>
    )
}
