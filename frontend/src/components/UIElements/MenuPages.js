import React, { useState } from 'react'
import searchImg from '../../assets/search.svg'
import arrowLeft from '../../assets/arrow_left.svg'
import ArrowRight from '../..//assets/arrow_right.svg'
import './MenuPages.css'

export default function MenuPages(props) {
    const [ searchInput, setSearchInput] = useState("")

    
    const handleChangeSearch = (e) =>{
        setSearchInput(e.target.value)
    }

    const submitSearch = () =>{
        props.handleSearch(searchInput)
        setSearchInput("")
    }

    return (
        <div className="menuProduct_container">
            <div className="products_search">
                <div className="search_container">
                    <input placeholder="search" onChange = {(e) => handleChangeSearch(e)} value={searchInput}/>
                    <button onClick = {submitSearch}><img src={searchImg} alt = "search"/></button>
                </div>
            </div>
            <div className="sort_products">
                <span>Sort By:</span>
                <select onChange={(e) => props.handleSort(e)} value={props.sort}>
                    <option value = "recently">Recent</option>
                    <option value = "name">Name</option>
                    <option value = "price">Price</option>
                </select>
            </div>
            <div className="perpage_products">
                <span>PerPage:</span>
                <select onChange={(e) => props.handlePerPage(e)} value={props.perPage}>
                    <option value="6">6</option>
                    <option value="12">12</option>
                    <option value="18">18</option>
                    <option value="24">24</option>
                    <option value="30">30</option>
                </select>
            </div>
            <div>
                {props.total} products
            </div>
            {props.total !== 0 && <div className="products_page">
                {props.page > 1 && <button onClick={() => props.handlePage(props.page - 1)}><img src={arrowLeft} alt = "back page" /></button>}
                <div className="actual">1</div>
                <div className="total">{props.lastPage}</div>
                {props.page !== props.lastPage && <button onClick={() => props.handlePage(props.page + 1)}><img src={ArrowRight} alt = "next page"/></button>}
            </div>}
        </div>
    )
}
