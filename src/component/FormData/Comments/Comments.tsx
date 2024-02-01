import React, { useEffect, useState } from "react";


import "./Comments.scss";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchComments } from "../../../store/slices/commentSlice";
import { useAppSelector } from "../../../store/hooks";
import Spinner from "../../Spinner";
import { formApiClient } from "../../..";

interface CommentsProps {
    close: React.Dispatch<React.SetStateAction<boolean>>;
}


const Comments: React.FC<CommentsProps> =  ({ close }) => {

    const dispatch = useDispatch();
    const params = useParams();

    const loading = useAppSelector(state => state.comment.loading);
    const comments = useAppSelector(state => state.comment.comments);

    const [comment, setComment] = useState<string>('');

    useEffect(() => {
        dispatch(fetchComments(params.id!));
    }, [dispatch, params.id]);



    const onAddComment = async () => {
        if (comment.length === 0) return;

        const data = {
            text: comment
        };

        await formApiClient.addCommentToForm(params.id!, data);
        setComment('');
        dispatch(fetchComments(params.id!));
    }

    const onDeleteComment = async (commentId: string) => {
        const res = await formApiClient.deleteFormComment(params.id!, commentId);
        if (res) {
            dispatch(fetchComments(params.id!));
        }
    }

    return (
        <div className="comments-conatiner">
            <div className="header">
                <div className="comments-header"><p>Comments</p><span onClick={() => close(false)}>X</span></div>
                <hr />
            </div>
           <div className="comments">
                {loading === 'fullfilled' ? comments.map((comment) => {

                    return (
                        <div key={comment.id} className="comment-box">
                            <div className="comment">
                                <p className="user-name">{comment.authorDisplayName}: </p>
                                <p className="text">{comment.text}</p>
                            </div>
                            <div className="delete-icon" onClick={() => onDeleteComment(comment.id)}>
                                <img className="icon" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHBhdGggZmlsbD0iIzJBMkYzNCIgZD0iTTE0IDF2MUgyVjFoM2wxLTFoNGwxIDF6TTMgM2gxMHYxMmExIDEgMCAwMS0xIDFINGExIDEgMCAwMS0xLTF6bTYgMTFoMVY1SDl6bS0zIDBoMVY1SDZ6Ii8+PC9zdmc+" alt=" " />
                            </div>
                        </div>
                    )
                }) : <Spinner />}
           </div>
           <div className="add-comment">
                <input type="text" placeholder="Write comment here." value={comment} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setComment(event.target.value);
                }}/>
                <p onClick={onAddComment}>Add Comment</p>
            </div>
        </div>
    )
}

export default Comments;