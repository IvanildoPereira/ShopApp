import React, { useState } from 'react'
import '../CrudProduct.css'
import remove from '../../../../assets/remove-sign.png'
import camera from '../../../../assets/camera.svg'


export default function UploadImages({images, setImage}) {
    const [error, setError] = useState('');
    const handleChange = (e) => {
        
        if(e.target.files[0].type === "image/png" || e.target.files[0].type === "image/jpg" || e.target.files[0].type === "image/jpeg"){
            const imageupload = {
                name: e.target.files[0].name,
                file: e.target.files[0],
                preview: URL.createObjectURL(e.target.files[0])
            }
            // const imageteste = [...images, imageupload]
            setError(null);
            setImage(prevImages => [...prevImages, imageupload])
        }else{
            setError("The type of file is invalid!")
        }
        
    }

    const handleDelete = (url) => {
        const newImages = images.filter(i => i.preview !== url);
        setImage(newImages);
    }

    const imageTitle = (index) =>{
        switch(index){
            case 0:
                return "Cover"
            case 1:
                return "Second Image"
            case 2:
                return "Third Image"
            default:
                return "Image"
        }
    }

    return (
        <>
        <div className="upload-images">
            <div className="preview">
                {
                    images.map((i, index) =>
                        <div className="img-container" key={index}>
                            <img className="img-preview" src={i.preview} alt = ""/>
                            <div onClick={() => handleDelete(i.preview)} className="button-delete">
                                <img src={remove} alt = "" />
                            </div>
                            <p style = {{fontSize: 10, fontWeight: "bold", textAlign: "center"}}>{imageTitle(index)}</p>
                        </div>
                        
                        )
                }
            </div>
            { images.length < 3 &&
            <div>
            <label id="photo">
                <input type="file" accept=".png, .jpg, .jpeg" onChange={handleChange} />
                <img src={camera} alt = ""/>
            </label>
            <p style = {{fontSize: 10, fontWeight: "bold", textAlign: "center"}}>Add Image</p>
            </div>
            }
            
        </div>
        {error && <p className="error">{error}</p>}
        
        </>
    )
}
