import React, { useState, useContext, useEffect } from 'react'
import './CrudProduct.css'

import { useParams, useHistory } from "react-router-dom";
import { useForm } from 'react-hook-form'

import { Card, ErrorModal, SuccessModal, LoadingSpinner } from '../../../components/index'

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import { formats, modules } from '../../../components/Utils/reactQuill'

import { categories } from '../../../components/Utils/categories'

import useFetch from '../../../hooks/useFetch'
import { AuthContext } from '../../../context/auth-context';



export default function NewProduct() {
    const auth = useContext(AuthContext);
    const { register, handleSubmit, errors } = useForm();
    const { isLoading, error, sendRequest, clearError } = useFetch();
    const [product, setProduct] = useState([]);
    const [details, setDetails] = useState("")
    const [success, setSuccess] = useState()
    const history = useHistory();
    const { id } = useParams();



    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProduct = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND}/product/${id}`
                );

                setProduct(responseData.product)
                setDetails(responseData.product.details)
            } catch (err) { }
        };
        fetchProduct();
    }, [sendRequest, id]);

    const redirectPage = () =>{
        history.push("/account/product/")
    }

    const onSubmit = async (data) => {
        try {
            const response = await sendRequest(`${process.env.REACT_APP_BACKEND}/product/edit/${id}`, 'POST',

                JSON.stringify({
                    name: data.productName,
                    price: data.price,
                    category: data.category,
                    details
                }),
                {
                    Authorization: 'Bearer ' + auth.token,
                    "Content-Type": "application/json"
                });

                setSuccess(response.message);


        } catch (err) { }

    }


    const handledetailChange = (content, delta, source, editor) => {
        setDetails(editor.getHTML());
    }

    return (
        <>
            <h1>Update Product</h1>
            <Card>
                {isLoading && <LoadingSpinner />}
                {success && <SuccessModal success = {success} onRedirect = {redirectPage}/>}
                {error && <ErrorModal error={error} onClear={clearError} />}
                {product && product.user_id !== auth.userId && <h2 style = {{color: "red"}}>You're not allowed to edit this product because you're not the owner!</h2>}
                <div className="productForm-container">
                    {product && 
                     product.user_id === auth.userId && 
                     <form>
                        <div className="form-group">
                            <div className="input-product">
                                <label>Name:</label>
                                <input name="productName" defaultValue={product.name} ref={register({ required: "The Product name is required!" })} />
                                {errors.productName && <p className="error">{errors.productName.message}</p>}
                            </div>
                            <div className="input-price">
                                <label>Price:</label>
                                <input type="number" defaultValue={product.price} placeholder="R$ 0.00" name="price" ref={register({ required: "The price is required!", min: { value: 1, message: 'The min price is 1' } })} />
                                {errors.price && <p className="error">{errors.price.message}</p>}
                            </div>
                            <div>
                                <label>Category:</label>
                                {product.categories && <select name="category" defaultValue={product.categories} ref={register}>
                                    {categories.map((category, index) =>
                                        category !== "All Products" && <option key={index} value={category}>{category}</option>
                                    )}
                                </select>}
                            </div>
                        </div>
                        <label>Description:</label>
                        <div>
                            <ReactQuill theme="snow" modules={modules}
                                formats={formats} onChange={handledetailChange}
                                value={details} />
                        </div>
                    </form>}
                </div>
            </Card>
            {product && product.user_id === auth.userId && 
            <div className="button-gruop">
                <button className="save" onClick={handleSubmit(onSubmit)}>Save Product</button>
            </div>}


        </>
    )
}
