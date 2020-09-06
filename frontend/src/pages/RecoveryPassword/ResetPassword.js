import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import "./RecoveryPassword.css";
import { useForm } from "react-hook-form";
import useFetch from "../../hooks/useFetch";
import { Card, LoadingSpinner, ErrorModal, SuccessModal } from "../../components/index"

export default function ResetPassword() {
    const { register, handleSubmit, errors } = useForm();
    const { isLoading, error, sendRequest, clearError } = useFetch();
    const [user, setUser] = useState()
    const [success, setSuccess] = useState();
    const { token } = useParams();
    const history = useHistory();

    const redirectPage = () => {
        history.push("/login")
    }

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND}/users/verify_token/`, 
                    "POST",
                    JSON.stringify({
                        token
                    }),
                    {
                        "Content-Type": "application/json",
                    }
                );
                setUser(responseData);
                console.log(responseData)
            } catch (err) { }
        };
        verifyToken();
    }, [sendRequest, token]);

    const recoverySubmit = async (data) => {
        try {
            const response = await sendRequest(
                `${process.env.REACT_APP_BACKEND}/users/reset_password`,
                "POST",
                JSON.stringify({
                    newPassword: data.newPassword,
                    token
                }),
                {
                    "Content-Type": "application/json",
                }
            );
            setSuccess(response.message);
        } catch (error) {
        }
    };

    return (
        <>
            <h1>Reset Password</h1>
            <Card>
                {isLoading && <LoadingSpinner />}
                {success && <SuccessModal success={success} onRedirect={redirectPage} />}
                {error && <ErrorModal error={error} onClear={clearError} />}
                {!user && !isLoading && <p>Token Invalid or Expired!</p>}
                {user && !isLoading && 
                <form className="recovery_page" onSubmit={handleSubmit(recoverySubmit)}>
                    <p style = {{fontWeight: "bold", textAlign: "center"}}>Hello <b>{user.name}</b>, choose a new password to reset.</p>
                    <label>New Password:</label>
                    <input
                        type="password"
                        ref={register({
                            required: "Password Required!",
                            minLength: {
                                value: 8,
                                message: "Too Shoot, please minlength is 8!",
                            },
                        })}
                        name="newPassword"
                        placeholder="Choose a strong Password"
                    />
                    {errors.password && (
                        <p className="error">{errors.newPassword.message}</p>
                    )}
                    <button type="submit">Reset Password</button>
                </form>}
            </Card>
        </>
    )
}
