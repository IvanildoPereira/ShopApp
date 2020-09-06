import React, { useState, useEffect, useCallback } from "react";
import queryString from "query-string";
import ProductAccordion from "./components/ProductAccordion";
import { MenuPages, LoadingSpinner, ErrorModal } from "../../../components/index";
import "./Products.css";
import ProductsGrid from "./components/ProductsGrid";
import useFetch from "../../../hooks/useFetch";
import { useHistory, useLocation } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState();
  const { isLoading, error, sendRequest, clearError } = useFetch();
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);
  const [perPage, setPerPage] = useState(6);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("recently");
  const location = useLocation();
  
  useEffect(() => {
    const parsed = queryString.parse(location.search);
    if (parsed.category) {
      setCategory(parsed.category);
    }

  },[location.search]);

  const queryParams = useCallback(()=>{
    const orderStringQuery = ["search", "category", "sort", "page", "perPage"];
    const query = queryString.stringify(
      { search, page, perPage, category, sort },
      {
        skipEmptyString: true,
        skipNull: true,
        sort: (a, b) =>
          orderStringQuery.indexOf(a) - orderStringQuery.indexOf(b),
      }
    );
    if(category && location.search !== "?" + query){
      history.push("/products?"+query)
    }
    return query;
  }, [search, page, perPage, category, sort, history]) //eslint-disable-line

  const handleSearch = (searchText) => {
    setSearch(searchText);
    setCategory("All Products");
  };

  const handlePerPage = (e) => {
    setPerPage(e.target.value);
  };

  const handleCategory = (categ) => {
    setCategory(categ);
    setPage(1);
    setSearch("");
  };

  const handlePage = (page) => {
    setPage(page);
  };

  const handleSort = (e) => {
    setSort(e.target.value);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND}/product/?${queryParams()}`
        );
        setProducts(responseData.products);
        setLastPage(responseData.lastPage);
        setTotal(responseData.total);
      } catch (err) {}
    };
    fetchProducts();
  }, [sendRequest, queryParams]);

  return (
    <>
      {error && <ErrorModal error = {error} onClear = {clearError}/>}
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

      <section id="product">
        <ProductAccordion handleCategory={handleCategory} categoryActive = {category}/>
        {isLoading && <LoadingSpinner />}
        {!isLoading && (
          <div className="products-grid" style={{ width: "100%" }}>
            {products &&
              products.map((product) => <ProductsGrid product={product} key = {product}/>)}
          </div>
        )}
      </section>
    </>
  );
}
