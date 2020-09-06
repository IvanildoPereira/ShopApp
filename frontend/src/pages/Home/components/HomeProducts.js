import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../../../components/index";

export default function HomeProducts({ products }) {
  return (
    <section id="products_home">
      <p className="sub_title">New Products</p>
      <div className="products_scroll">
        {products.map((product) => (
          <Card>
            <img
              src={`${process.env.REACT_APP_BACKEND}/${product.cover_img}`}
              alt=""
            />
            <div style = {{height: 100}}>
              <p className="name">{product.name}</p>
              <p className="price">
                price: <span>{product.price.toFixed(2)}</span>
              </p>
            </div>
            <Link to={`/product/${product.id}`}>See More</Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
