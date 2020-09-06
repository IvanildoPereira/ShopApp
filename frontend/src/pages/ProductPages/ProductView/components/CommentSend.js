import React, { useState, useContext } from "react";
import useFetch from "../../../../hooks/useFetch";
import { AuthContext } from "../../../../context/auth-context";
import { LoadingSpinner, ErrorModal, SuccessModal } from "../../../../components/index";


export default function CommentSend({ productId, user,  id }) {
  const [postComment, setPostComment] = useState();
  const { isLoading, error, sendRequest, clearError } = useFetch();
  const [success, setSuccess] = useState()
  
  
  const auth = useContext(AuthContext);

  const redirectPage = () =>{
    window.location.reload()
  }

  const submitComment = async () => {
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND}/users/comment`,
        "POST",
        JSON.stringify({
          productId,
          body: postComment,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setSuccess(response.message);
    } catch (err) {}
  };


  return (
    <>
      {error && <ErrorModal error={error} onClear={clearError} />}
      {success && <SuccessModal success = {success} onRedirect = {redirectPage}/>}
      {isLoading && <LoadingSpinner />}
      {!isLoading && (
        <>
          <div className="avatar">
            <img
              src="https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_960_720.png"
              alt=""
            />
            <p>{user}</p>
          </div>
          <div className="message-text">
            <div>
              <textarea
                onChange={(e) => setPostComment(e.target.value)}
                placeholder="Write a comment..."
                maxLength="300"
              ></textarea>
            </div>
            <button onClick={submitComment} className="send-btn">
              Send
            </button>
          </div>
        </>
      )}
    </>
  );
}
