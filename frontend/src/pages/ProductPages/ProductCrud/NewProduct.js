import React, { useState, useContext } from 'react'
import './CrudProduct.css'

import { useHistory } from "react-router-dom";
import { useForm } from 'react-hook-form'


import UploadImages from './components/UploadImages'
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
    const { isLoading, error, sendRequest, clearError } = useFetch()
    const [detail, setDetail] = useState('')
    const [images, setImage] = useState([]);
    const [success, setSuccess] = useState()
    const history = useHistory();

    const redirectPage = () =>{
        history.push("/account/product/")
    }
    
    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append('cover_img', images[0].file);
            if (images[1]) { formData.append('second_img', images[1].file); }
            if (images[2]) { formData.append('third_img', images[2].file); }
            formData.append('name', data.productName);
            formData.append('category', data.category)
            formData.append('price', data.price);
            formData.append('details', detail);
            const response = await sendRequest(`${process.env.REACT_APP_BACKEND}/product/create`, 'POST', formData, {
                Authorization: 'Bearer ' + auth.token
            });


            setSuccess(response.message);

        } catch (err) { console.log(err) }

    }


    const handledetailChange = (content, delta, source, editor) => {
        setDetail(editor.getHTML());
    }

    return (
        <>
            <h1>Create new product</h1>
            <Card>
                <div className="productForm-container">
                    <form>
                        {isLoading && <LoadingSpinner />}
                        {error && <ErrorModal error={error} onClear={clearError} />}
                        {success && <SuccessModal success = {success} onRedirect = {redirectPage}/>}
                        <div className="form-group">
                            <div className="input-product">
                                <label>Name:</label>
                                <input name="productName" ref={register({ required: "The Product name is required!" })} />
                                {errors.productName && <p className="error">{errors.productName.message}</p>}
                            </div>
                            <div className="input-price">
                                <label>Price:</label>
                                <input type="number" placeholder="R$ 0.00" name="price" ref={register({ required: "The price is required!", min: { value: 1, message: 'The min price is 1' } })} />
                                {errors.price && <p className="error">{errors.price.message}</p>}
                            </div>
                            <div>
                                <label>Category:</label>
                                <select name="category" ref={register}>
                                    {categories.map((category, index) =>
                                        category !== "All Products" && <option key={index} value={category}>{category}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <label>Description:</label>
                        <div>
                            <ReactQuill theme="snow" modules={modules}
                                formats={formats} onChange={handledetailChange}
                                value={detail || ''} />
                        </div>
                        <label>Product Images:</label>
                        <UploadImages images={images} setImage={setImage} />
                    </form>


                </div>
            </Card>
            <div className="button-gruop">
                <button className="save" onClick={handleSubmit(onSubmit)}>Save Product</button>
            </div>
        </>
    )
}
