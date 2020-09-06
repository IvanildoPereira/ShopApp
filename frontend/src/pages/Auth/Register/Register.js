import React, { useState } from "react";
import { useHistory } from "react-router-dom"
import { useForm } from "react-hook-form";
import "./Register.css";
import useFetch from "../../../hooks/useFetch";
import { Card, LoadingSpinner, SuccessModal, ErrorModal } from "../../../components/index"


export default function Register() {
  const { register, handleSubmit, errors } = useForm();
  const { isLoading, error, sendRequest, clearError } = useFetch();
  const [success, setSuccess] = useState();
  const history = useHistory();
  
  const redirectPage = () =>{
    history.push("/login")
  }
  
  const onSubmit = async (data) => {
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND}/users/register`,
        "POST",
        JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      setSuccess(response.message);
    } catch (error) {}
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorModal error={error} onClear={clearError} />}
      {success && <SuccessModal success = {success} onRedirect = {redirectPage}/>}
      {!isLoading && (
        <>
          <h1>Create Account</h1>
          <Card>
            <div className="form-container">
              <form onSubmit={handleSubmit(onSubmit)}>
                <label>Name:</label>
                <input
                  ref={register({ required: "Name Required!" })}
                  name="name"
                  placeholder="Your Name"
                />
                {errors.name && <p className="error">{errors.name.message}</p>}

                <label>Email:</label>
                <input
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

                <label>Password:</label>
                <input
                  type="password"
                  ref={register({
                    required: "Password Required!",
                    minLength: {
                      value: 8,
                      message: "Too Shoot, please minlength is 8!",
                    },
                  })}
                  name="password"
                  placeholder="Choose a strong Password"
                />
                {errors.password && (
                  <p className="error">{errors.password.message}</p>
                )}
                <button type="submit">Sign Up</button>
              </form>
            </div>
          </Card>
        </>
      )}
    </>
  );
}
