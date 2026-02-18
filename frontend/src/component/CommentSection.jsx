import { useEffect, useState } from "react";
import {
    getCommentsApi,
    addCommentApi,
    updateCommentApi,
    deleteCommentApi
} from "../api/commentApi";

import { useAuth } from "../context/AuthContext";

const CommentSection = ({ videoId }) => {

    const { user } = useAuth();
    console.log("User in CommentSection:", user);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [matchComment,setMatchComment] = useState([]);
    const fetchComments = async () => {
        try {
            const res = await getCommentsApi(videoId);
            console.log("Comments fetched:",res.data);
            const myComments = res.data.filter((comment) => {
                // console.log("Checking comment:", comment);
                // console.log("Comment's user_id:", comment.user_id._id);
                // console.log("Current user ID:", user.id);
                // console.log("Match condition:",comment.user_id._id === user.id);
                return user && comment.user_id && comment.user_id._id === user.id;
            }
            );
            console.log("My Comments:", myComments);
            setMatchComment(myComments);
            setComments(res.data);;
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchComments();
        
    }, [videoId]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const res = await addCommentApi(videoId, newComment);
            console.log("Add comment response:", res.data);
            setComments(prev => [res.data, ...prev]);
            setNewComment("");
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await deleteCommentApi(commentId);
            setComments(prev =>
                prev.filter(comment => comment._id !== commentId)
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = async (commentId) => {
        try {
            const res = await updateCommentApi(commentId, editText);
            setComments(prev =>
                prev.map(comment =>
                    comment._id === commentId
                        ? res.data
                        : comment
                )
            );
            setEditingId(null);
        } catch (error) {
            console.error(error);
        }
    };
    // console.log("MatchComment:",matchComment);
    // console.log("comments",comments.user_id._id);
    return (
        <div>
            <h3>Comments</h3>
            {user && (
                <div>
                    <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                    />
                    <button onClick={handleAddComment}>Submit</button>
                </div>
            )}
            <br>
            </br>
            <ul>
                {
                comments.map(comment => (
                    <li key={comment._id}>
                        {editingId === comment._id ? (
                            <div>
                                <textarea
                                    value={editText}
                                    onChange={e => setEditText(e.target.value)}
                                />
                                <button onClick={() => handleEdit(comment._id)}>Save</button>
                                <button onClick={() => setEditingId(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                <p>{comment.commentText}</p>
                                {user && user.id === comment.user_id.id && (
                                    <div>
                                        <button onClick={() => {
                                            setEditingId(comment._id);
                                            setEditText(comment.commentText);
                                        }}>Edit</button>
                                        <button onClick={() => handleDelete(comment._id)}>Delete</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommentSection;
