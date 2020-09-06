import React from "react";
import { Link } from "react-router-dom"
import "./TableProducts.css";

export default function TableProducts({ products, deleteProduct }) {
  return (
    
      <tbody>
        {products && products.map((product) => (
          <tr>
            <td data-column="ID">{product.id}</td>
            <td data-column="Image"><img src = {`${process.env.REACT_APP_BACKEND}/${product.cover_img}`} alt = "product" /></td>
            <td data-column="Name">{product.name}</td>
            <td data-column="Price">$ {product.price.toFixed(2)}</td>
            <td data-column="Category">{product.categories}</td>
            <td data-column="Actions">
              <Link to = {`/account/product/edit/${product.id}`} className = "btn_edit">Edit</Link>
              <button className = "btn_delete" onClick = {() => deleteProduct(product.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    
  );
}
