import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import { Account, Login, Register, UpdateUser, Cart, Contact, Home, Orders, Products, ProductView, UserProducts, NewProduct, EditProduct, ForgotPassword, ResetPassword } from './pages/index'
import './App.css';
import Header from './components/Navigation/Header'
import Footer from './components/Footer/Footer'
import { AuthContext } from './context/auth-context';
import { useAuth } from './hooks/auth-hook'
import useFetch from './hooks/useFetch'


import LoadingSpinner from './components/UIElements/LoadingSpinner'
import { CartContext } from './context/cart-context';
import ErrorModal from "./components/UIElements/ErrorModal";


function App() {
  const { token, login, logout, userId, isLoading, socket } = useAuth();
  const { isLoading: loadingCart, error, sendRequest, clearError } = useFetch()
  
  const [cart, setCart] = useState(0);
  const [length, setLength] = useState(0)
  let routes;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND}/cart/`, "GET", null, {
            Authorization: 'Bearer ' + token
        });
        setCart(responseData.productsCart)
        setLength(responseData.length)
      } catch (err) { }
    };

    if (token) {
      fetchProducts()
      if(socket){
      socket.on('cart', data =>{
        fetchProducts();
      })}
    }

  }, [sendRequest, token, socket])

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/products" exact component={Products} />
        <Route path="/contact" exact component={Contact} />
        <Route path="/product/:id" exact component={ProductView} />
        <Route path="/cart/" exact component={Cart} />
        <Route path="/orders/" exact component={Orders} />
        <Route path="/account/" exact component={Account} />
        <Route path="/account/product/create" exact component={NewProduct} />
        <Route path="/account/product/" exact component={UserProducts} />
        <Route path="/account/product/edit/:id" exact component={EditProduct} />
        <Route path="/account/update-user" exact component={UpdateUser} />
        <Redirect to="/" />
      </Switch>
    )



  } else {
    routes = (
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/products" exact component={Products} />
          <Route path="/contact" exact component={Contact} />
          <Route path="/product/:id" exact component={ProductView} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <Route path="/forgot_password" exact component={ForgotPassword} />
          <Route path="/reset_password/:token" exact component={ResetPassword} />
          <Redirect to="/login" />
        </Switch>
    
    )
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, token: token, userId: userId, login: login, logout: logout, socket: socket }}>
      <Router>
        <CartContext.Provider value={{cart:cart, length:length, loadingCart}}>
          <Header />
          <div className="container">
            <main>
              {isLoading && <LoadingSpinner />}
              {error && <ErrorModal error = {error} onClear = {clearError}/>}
              {!isLoading && routes}
            </main>
          </div>
          <Footer />
        </CartContext.Provider>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
