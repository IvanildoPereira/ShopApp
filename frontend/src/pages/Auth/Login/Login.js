import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./Login.css";
import { AuthContext } from "../../../context/auth-context";
import useFetch from "../../../hooks/useFetch";
import { Card, LoadingSpinner, ErrorModal } from "../../../components/index"


export default function Login() {
  const auth = useContext(AuthContext);
  const { register, handleSubmit, errors } = useForm();
  const { isLoading, error, sendRequest, clearError } = useFetch();
  const authHandleSubmit = async (data) => {
    try {
      const res = await sendRequest(
        `${process.env.REACT_APP_BACKEND}/users/login`,
        "POST",
        JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      auth.login(res.id, res.token);
    } catch (error) {
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorModal error = {error} onClear = {clearError}/>}
      {!isLoading && (
        <>
          <h1>Login</h1>
          <Card>
            <div className="form-container">
              <form onSubmit={handleSubmit(authHandleSubmit)}>
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
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="error">{errors.password.message}</p>
                )}

                <button type="submit">Sign In</button>
                <Link className = "forgot_link" to = "/forgot_password">Forgot Password</Link>
              </form>
            </div>
          </Card>
        </>
      )}
    </>
  );
}
