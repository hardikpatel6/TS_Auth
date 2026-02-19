import { useEffect, useState, useCallback } from "react";
import {
    getCommentsApi,
    addCommentApi,
    updateCommentApi,
    deleteCommentApi
} from "../api/commentApi";

import { useAuth } from "../context/AuthContext";

const CommentSection = ({ videoId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    const fetchComments = useCallback(
        async () => {
            try {
                const res = await getCommentsApi(videoId);
                setComments(res.data);
            } catch (error) {
                console.error(error);
            }
        }, [videoId]);

    useEffect(() => {
        fetchComments();
    }, [videoId]);

    const handleAddComment = useCallback(
        async () => {
        if (!newComment.trim()) return;
        try {
            const res = await addCommentApi(videoId, newComment);
            const newCommentObj = {
                ...res.data.comment,
                user_id: {
                    _id: user.id,
                    name: user.name
                }
            };
            setComments(prev => [...prev, newCommentObj]);
            setNewComment("");
        } catch (error) {
            console.error(error);
        }
    }, [newComment, videoId, user] );
    const handleEditClick = useCallback (
        (comment) => {
        setEditingId(comment._id);
        setEditText(comment.commentText);
    }, []);
    const handleUpdateComment = useCallback (
        async (commentId) => {
        if (!editText.trim()) return;
        try {
            const res = await updateCommentApi(commentId, editText);
            setComments(prev =>
                prev.map(comment =>
                    comment._id === commentId
                        ? {
                            ...comment,
                            commentText: editText
                        }
                        : comment
                )
            );
            setEditingId(null);
            setEditText("");
        } catch (error) {
            console.error(error);
        }
    }, [editText] );

    const handleDelete = useCallback (
        async (commentId) => {
        try {
            await deleteCommentApi(commentId);
            setComments(prev =>
                prev.filter(comment => comment._id !== commentId)
            );
        } catch (error) {
            console.error(error);
        }
    } , []);

    return (
        <div>
            <br></br>
            <h1>Comments</h1>
            <br></br>
            {
                user ? (
                    <div>
                        <input className="border border-gray-300 rounded p-2 w-full"
                            type="text"
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                        />
                        <br>
                        </br>
                        <button className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleAddComment}>Submit</button>
                    </div>
                ) : (
                    <p>Please log in to comment.</p>
                )
            }
            <ul>
                {comments.map(comment => (
                    <li key={comment._id} className="mb-4 border-b pb-2">
                        {editingId === comment._id ? (
                            <>
                                <input
                                    className="border border-gray-300 rounded p-2 w-full"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                />
                                <button
                                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2 mt-2"
                                    onClick={() => handleUpdateComment(comment._id)}
                                >
                                    Save
                                </button>
                                <button
                                    className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 mt-2"
                                    onClick={() => {
                                        setEditingId(null);
                                        setEditText("");
                                    }}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <p>{comment.commentText}</p>
                                <p className="text-sm text-gray-600">
                                    By: {comment.user_id?.name}
                                </p>
                                {/* Only show edit/delete for comment owner */}
                                {comment.user_id?._id === user.id && (
                                    <>
                                        <button
                                            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                                            onClick={() => handleEditClick(comment)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                                            onClick={() => handleDelete(comment._id)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommentSection;
