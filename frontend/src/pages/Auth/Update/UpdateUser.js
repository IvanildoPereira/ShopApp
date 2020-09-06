import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom"
import { useForm } from "react-hook-form";
import { AuthContext } from '../../../context/auth-context';
import "./UpdateUser.css";
import Card from "../../../components/UIElements/Card";
import useFetch from "../../../hooks/useFetch";
import ErrorModal from "../../../components/UIElements/ErrorModal";
import LoadingSpinner from "../../../components/UIElements/LoadingSpinner";
import SuccessModal from "../../../components/UIElements/SuccessModal";

export default function UpdateUser() {
  const auth = useContext(AuthContext);
  const { register, handleSubmit, errors } = useForm();
  const { isLoading, error, sendRequest, clearError } = useFetch();
  const [success, setSuccess] = useState()
  const history = useHistory();
  const [image, setImage] = useState();
  const [user, setUser] = useState();
  const [preview, setPreview] = useState();
  const [checked, setChecked] = React.useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND}/users/`, "GET", null, {
          Authorization: 'Bearer ' + auth.token,
        }
        );
        setUser(responseData)
        const avatar = responseData.avatar_img !== null ? `${process.env.REACT_APP_BACKEND}/${responseData.avatar_img}` : "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_960_720.png"
        setPreview(avatar)
      } catch (err) { }
    };
    fetchUser();
  }, [sendRequest, auth.token]);

  const handleChangeImage = (e) => {

    if (e.target.files[0].type === "image/png" || e.target.files[0].type === "image/jpg" || e.target.files[0].type === "image/jpeg") {
      setImage(e.target.files[0])
      console.log(e.target.files[0])
      setPreview(URL.createObjectURL(e.target.files[0]))
    } else {
      //setError("The type of file is invalid!")
    }

  }

  const redirectPage = () =>{
    history.push("/account")
  }

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('avatar_img', image);
      formData.append('name', data.name);
      formData.append('email', data.email)
      if(checked){
        formData.append('oldPassword', data.oldPassword);
        formData.append('newPassword', data.newPassword);
      }
      
      const response = await sendRequest(`${process.env.REACT_APP_BACKEND}/users/update`, 'POST', formData, {
        Authorization: 'Bearer ' + auth.token
      });

      setSuccess(response.message);

    } catch (err) { console.log(err) }
  }



  return (
    <>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorModal error={error} onClear={clearError} />}
      {success && <SuccessModal success = {success} onRedirect = {redirectPage}/>}
      {!isLoading && (
        <>
          <h1>Update Account</h1>
          <Card>
            {user && <>
              <div className="update-user">
                <form className="user_account">
                  <img src={preview || user.avatar_img} alt = ""/>
                  <label id="photo-user">
                    <input type="file" accept=".png, .jpg, .jpeg" onChange={handleChangeImage} />
                  Choose an Image
                </label>
                </form>
                <div className="form-container">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <label>Name:</label>
                    <input defaultValue={user.name}
                      ref={register({ required: "Name Required!" })}
                      name="name"
                      placeholder="Your Name"
                    />
                    {errors.name && <p className="error">{errors.name.message}</p>}

                    <label>Email:</label>
                    <input defaultValue={user.email}
                      ref={register({
                        required: "Email required!",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      name="email"
                      placeholder="john@doe.com"
                    />
                    {errors.email && (
                      <p className="error">{errors.email.message}</p>
                    )}

                    <div className = "checkbox_user">
                      
                    <input type = "checkbox"
                    status={checked ? 'checked' : 'unchecked'}
                    onChange={() => {setChecked(!checked)}}/>
                    <label> Change Password</label>
                    </div>
                      
                   <div style = {{display: checked ? "initial" : "none"}}>
                   <label>Password:</label>
                    <input
                      type="password"
                      ref={register({
                        minLength: {
                          value: 8,
                          message: "Too Shoot, please minlength is 8!",
                        },
                      })}
                      name="oldPassword"
                      placeholder="Write the old Password"
                    />
                    {errors.password && (
                      <p className="error">{errors.oldPassword.message}</p>
                    )}

                    <label>New Password:</label>
                    <input
                      type="password"
                      ref={register({
                        minLength: {
                          value: 8,
                          message: "Too Shoot, please minlength is 8!",
                        },
                      })}
                      name="newPassword"
                      placeholder="Choose a new strong Password"
                    />
                    {errors.password && (
                      <p className="error">{errors.newPassword.message}</p>
                    )}
                   </div>

                  </form>
                </div>
              </div>
              <div className="save-user">
                <button type="submit" onClick={handleSubmit(onSubmit)}>Save</button>
              </div>
            </>
            }

          </Card>
        </>
      )}
    </>
  );
}
