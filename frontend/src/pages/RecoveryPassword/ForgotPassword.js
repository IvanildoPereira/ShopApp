import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import "./RecoveryPassword.css";
import { useForm } from "react-hook-form";
import useFetch from "../../hooks/useFetch";
import { Card, LoadingSpinner, ErrorModal, SuccessModal } from "../../components/index"

export default function ForgotPassword() {
    const { register, handleSubmit, errors } = useForm();
    const { isLoading, error, sendRequest, clearError } = useFetch();
    const [success, setSuccess] = useState();
    const history = useHistory();

    const redirectPage = () => {
        history.push("/login")
    }

    const recoverySubmit = async (data) => {
        try {
            const response = await sendRequest(
                `${process.env.REACT_APP_BACKEND}/users/forgot_password`,
                "POST",
                JSON.stringify({
                    email: data.email,
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
            <h1>Forgot Password</h1>
            <Card>
                {isLoading && <LoadingSpinner />}
                {success && <SuccessModal success = {success} onRedirect = {redirectPage}/>}
                {error && <ErrorModal error={error} onClear={clearError} />}
                {!isLoading && <form className="recovery_page" onSubmit={handleSubmit(recoverySubmit)}>
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
                    <button type="submit">Recovery</button>
                </form>}
            </Card>
        </>
    )
}
