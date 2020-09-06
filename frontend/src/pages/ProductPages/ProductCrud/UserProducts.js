import React, { useState, useEffect, useCallback, useContext } from "react";
import { Link } from 'react-router-dom';
import { AuthContext } from "../../../context/auth-context"
import queryString from "query-string";
import useFetch from "../../../hooks/useFetch";

import { LoadingSpinner, ErrorModal, SuccessModal, MenuPages } from "../../../components/index";

import "./UserProducts.css"
import TableProducts from "./components/TableProducts";

export default function UserProducts() {
  const [products, setProducts] = useState();
  const { isLoading, error, sendRequest, clearError } = useFetch();
  const auth = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);
  const [perPage, setPerPage] = useState(6);
  const [sort, setSort] = useState("recently");
  const [total, setTotal] = useState(0);
  const [success, setSuccess] = useState()


  const handleSearch = (searchText) => {
    setSearch(searchText);
    setPage(1);
  };

  const handlePerPage = (e) => {
    setPerPage(e.target.value);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  const handleSort = (e) => {
    setSort(e.target.value);
  };

  const queryParams = useCallback(() => {
    return queryString.stringify(
      { search, page, perPage, sort },
      { skipEmptyString: true, skipNull: true }
    );
  }, [search, page, perPage, sort])




  const redirectPage = () => {
    window.location.reload()
  }

  const deleteProduct = async (productId) => {
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND}/product/delete/${productId}`, "DELETE", null, {
        Authorization: 'Bearer ' + auth.token
      }
      );

      setSuccess(response.message);


    } catch (err) {

    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND}/product/owner/${auth.userId}/?${queryParams()}`
        );
        setProducts(responseData.products);
        setLastPage(responseData.lastPage);
        setTotal(responseData.total);
        console.log(responseData);
      } catch (err) { }
    };

    fetchProducts();
  }, [sendRequest, queryParams, auth.userId]);

  return (
    <>
      <MenuPages
        page={page}
        sort={sort}
        perPage={perPage}
        lastPage={lastPage}
        total={total}
        handlePage={handlePage}
        handleSort={handleSort}
        handleSearch={handleSearch}
        handlePerPage={handlePerPage}
      />
      {error && <ErrorModal error={error} onClear={clearError} />}
      {success && <SuccessModal success = {success} onRedirect = {redirectPage}/>}
      {isLoading && <LoadingSpinner />}

      <div className="table_container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Img</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <TableProducts products={products} deleteProduct={deleteProduct} />
        </table>
        <Link class="create_product" to="/account/product/create">+</Link>
      </div>
    </>
  );
}
