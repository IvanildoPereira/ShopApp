import React from "react";
import { format } from 'date-fns'
import { Card } from "../../../../components/index";

export default function Comments({ comment }) {
  return (
    <Card>
    <div className = "comment_date"><span>{format(new Date(comment.createdAt), 'E yyyy MMM dd')}</span></div>
      <div className="comments">
        <div className="avatar">
          <img
            src={comment.user.avatar_img !== null ? `${process.env.REACT_APP_BACKEND}/${comment.user.avatar_img}` : "https://i.pinimg.com/originals/67/b8/5b/67b85b9ddb6c9250b3e1b2b8d53b631f.jpg"}
            alt=""
          />
          <p>{comment.user.name}</p>
        </div>
        <div className="comment-text">
          {comment.body}
        </div>
      </div>
    </Card>
  );
}
