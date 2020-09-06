import React, { useState } from 'react'
import "./Contact.css"
import { useForm } from "react-hook-form";
import useFetch from "../../hooks/useFetch";
import { Card, LoadingSpinner, SuccessModal, ErrorModal } from "../../components/index"


export default function Contact() {
    const { register, handleSubmit, errors } = useForm();
    const { isLoading, error, sendRequest, clearError } = useFetch();
    const [success, setSuccess] = useState();

    const redirectPage = () => {
        window.location.reload();
    }

    const onSubmit = async (data) => {
        try {
            const response = await sendRequest(
                `${process.env.REACT_APP_BACKEND}/feedback`,
                "POST",
                JSON.stringify({
                    email: data.email,
                    subject: data.subject,
                    message: data.message
                }),
                {
                    "Content-Type": "application/json",
                }
            );
            setSuccess(response.message);
        } catch (error) { }
    };

    return (
        <div>
            <h1>Contact</h1>
            <Card>
                {isLoading && <LoadingSpinner />}
                {error && <ErrorModal error={error} onClear={clearError} />}
                {success && <SuccessModal success={success} onRedirect={redirectPage} />}
                {!isLoading &&
                    <form className="email_form" onSubmit={handleSubmit(onSubmit)}>
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
                            placeholder=""
                        />
                        {errors.email && (
                            <p className="error">{errors.email.message}</p>
                        )}

                        <label>Subject:</label>
                        <input
                            ref={register({ required: "Subject Required!" })}
                            name="subject"
                            placeholder=""
                        />
                        {errors.subject && <p className="error">{errors.subject.message}</p>}

                        <label>Message:</label>
                        <textarea
                            ref={register({ required: "Message Required!" })}
                            name="message"
                            placeholder=""
                        />
                        {errors.message && <p className="error">{errors.message.message}</p>}

                        <button className="btn-send" type="submit">Send</button>
                    </form>
                }
            </Card>
        </div>
    )
}
