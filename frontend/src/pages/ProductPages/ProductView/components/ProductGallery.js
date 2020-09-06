import React, { useState, useRef, useEffect } from 'react'
import '../ProductView.css'

export default function ProductGallery({product}) {
    const [thumb, setThumb] = useState(product.cover_img)
    const [lengthUl, setLengthUl] = useState(null);
    let ulRef = useRef(null);
    
    useEffect(() =>{
        setLengthUl(ulRef.children.length)
    },[])

   
    
    return (
        <div className="product-gallery">
            <div className="product-gruop">
                <div className="product-thumb">
                    <img alt = "" src = {`${process.env.REACT_APP_BACKEND}/${thumb}`}/>
                </div>
                <ul ref = {el => ulRef = el} className={`product-img-${lengthUl}`}>
                    {product.cover_img && <li className={thumb === product.cover_img ? 'product-item active-product': 'product-item'} onClick={() => setThumb(product.cover_img)}><img alt = "" src = {`${process.env.REACT_APP_BACKEND}/${product.cover_img}`}/></li>}
                    {product.second_img && <li className={thumb === product.second_img ? 'product-item active-product': 'product-item'} onClick={() => setThumb(product.second_img)}><img alt = "" src = {`${process.env.REACT_APP_BACKEND}/${product.second_img}`}/></li>}
                    {product.third_img && <li className={thumb === product.third_img ? 'product-item active-product': 'product-item'} onClick={() => setThumb(product.third_img)}><img alt = "" src = {`${process.env.REACT_APP_BACKEND}/${product.third_img}`}/></li>}
                </ul>
            </div>
        </div>
    )
}
