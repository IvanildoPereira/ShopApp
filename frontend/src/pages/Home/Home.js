import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import useFetch from "../../hooks/useFetch";
import HomeCategories from "./components/HomeCategories";
import HomeProducts from "./components/HomeProducts";
import { LoadingSpinner, ErrorModal } from "../../components/index";



export default function Home() {
  const { isLoading, error, sendRequest, clearError } = useFetch();
  const [products, setProducts] = useState();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND}/product/?sort=recently&page=1&perPage=5`
        );
        setProducts(responseData.products);
      } catch (err) {}
    };
    fetchProducts();
  }, [sendRequest]);

  return (
    <>
      <section id="home_section">
        <div className="background_img">
          <div className="container">
            <h1>Here Your morney is well spend!</h1>
            <Link to = "/products">Start Buy Now</Link>
          </div>
        </div>
      </section>
      {error && <ErrorModal error = {error} onClear = {clearError}/>}
      {isLoading && <LoadingSpinner/>}
      {products && !isLoading && <HomeProducts products = {products}/>}
      <HomeCategories/>
      
    </>
  );
}
