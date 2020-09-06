import React, { useState } from 'react'
import { categories } from '../../../../components/Utils/categories'
import './ProductAccordion.css'

export default function ProductAccordion(props) {
    const [active, setActive] = useState("");
    const [height, setheight] = useState("max-content");

    const toogleAccordion = () => {
        setActive(active === "" ? "active" : "")
        setheight(active === "active" ? "max-content" : "0px")
    }

    return (
        <div className="accordion">
            <button className={`accordion_button ${active}`} onClick={toogleAccordion}>Categories</button>
            <ul className="accordion_content" style={{ maxHeight: `${height}` }}>
                {categories.map((category, index) =>
                    <li key={index}
                        className = {props.categoryActive === category ? "active" : ""}
                        onClick={() => {
                            props.handleCategory(category);
                        }}>
                        {category}
                    </li>
                )}
            </ul>
        </div>
    )
}
