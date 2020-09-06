import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import  useFetch  from '../../../hooks/useFetch'
import ProductGallery from './components/ProductGallery'

import { Card, LoadingSpinner, ErrorModal } from "../../../components/index";

import ProductInfo from './components/ProductInfo'
import { AuthContext } from '../../../context/auth-context'
import './ProductView.css'
import './MessageSend.css'
import CommentSend from './components/CommentSend'
import Comments from './components/Comments'

export default function ProductsView() {
    const auth = useContext(AuthContext)
    const [product, setProduct] = useState();
    const [comments, setComments] = useState()
    const { isLoading, error, sendRequest, clearError } = useFetch();
    const { id } = useParams();
    
    
    useEffect(() => {
      window.scrollTo(0, 0);
        const fetchProduct = async () => {
          try {
            const responseData = await sendRequest(
              `${process.env.REACT_APP_BACKEND}/product/${id}`
            );
            console.log(responseData)
            setProduct(responseData.product);
            setComments(responseData.comments)
          } catch (err) {}
        };
        fetchProduct();
      }, [sendRequest, id]);

    return (
        <>
        {error && <ErrorModal error = {error} onClear = {clearError}/>}
        {isLoading && <LoadingSpinner />}
        {!isLoading && product &&
            <Card>
                <div className="product-section">
                    <ProductGallery product={product}/>
                    <ProductInfo product={product} sendRequest = {sendRequest}/>
                </div>

                {auth.isLoggedIn && <div className="message-send">
                    <CommentSend id = {id} productId = {product.id} />
                </div>}
            </Card>}

            {!isLoading && comments && comments.map((comment, index) =>
                <Comments key = {index} comment = {comment}/>
            )}
        </>
    )
}
