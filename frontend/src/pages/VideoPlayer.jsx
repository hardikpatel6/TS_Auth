import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getVideoByIdApi,
    likeVideoApi,
    dislikeVideoApi,
    subscribeVideoApi,
    unsubscribeVideoApi
} from "../api/videoApi";
import CommentSection from "../component/CommentSection";
const VideoPlayer = () => {

    const { id } = useParams();

    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const [likeCount, setLikeCount] = useState(0);
    const [dislikeCount, setDislikeCount] = useState(0);
    const [subscriberCount, setSubscriberCount] = useState(0);

    //////////////////////////////////////////////////////
    // Fetch video
    //////////////////////////////////////////////////////

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await getVideoByIdApi(id);
                const data = res.data;
                setVideo(data);
                setLikeCount(data.likesCount);
                setDislikeCount(data.dislikesCount);
                setSubscriberCount(data.subscribersCount);
                setIsLiked(data.isLiked);
                setIsDisliked(data.isDisliked);
                setIsSubscribed(data.isSubscribed);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVideo();
    }, [id]);

    const handleLike = async () => {
        try {
            const res = await likeVideoApi(video._id);
            const newLikes = res.data.likes;
            setLikeCount(newLikes);
            // toggle state
            setIsLiked(prev => !prev);
            // remove dislike if exists
            if (isDisliked) {
                setIsDisliked(false);
                setDislikeCount(prev => prev - 1);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const handleDislike = async () => {
        try {
            const res = await dislikeVideoApi(video._id);
            const newDislikes = res.data.dislikes;
            setDislikeCount(newDislikes);
            setIsDisliked(prev => !prev);
            if (isLiked) {
                setIsLiked(false);
                setLikeCount(prev => prev - 1);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubscribe = async () => {
        try {
            const res = await subscribeVideoApi(video._id);
            const data = res.data;
            setIsSubscribed(true);
            setSubscriberCount(data.subscribersCount);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUnsubscribe = async () => {
        try {
            const res = await unsubscribeVideoApi(video._id);
            const data = res.data;
            setIsSubscribed(false);
            setSubscriberCount(data.subscribersCount);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading)
        return <div className="text-center mt-10">Loading...</div>;

    if (!video)
        return <div className="text-center mt-10">Video not found</div>;

    return (
        <>
            <div className="flex justify-center px-4 mt-6">
                <div className="w-full max-w-4xl">
                    <div className="aspect-video bg-black rounded-xl overflow-hidden">
                        <video controls className="w-full h-full">
                            <source src={video.url} type="video/mp4" />
                        </video>
                    </div>
                    <h1 className="text-xl font-semibold mt-4">
                        {video.title}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {video.description}
                    </p>
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={handleLike}
                            className={`px-4 py-2 text-white rounded ${isLiked ? "bg-blue-700" : "bg-blue-500"
                                }`}
                        >
                            👍 {likeCount}
                        </button>
                        <button
                            onClick={handleDislike}
                            className={`px-4 py-2 text-white rounded ${isDisliked ? "bg-red-700" : "bg-red-500"
                                }`}
                        >
                            👎 {dislikeCount}
                        </button>
                        {
                            isSubscribed
                                ?
                                <button
                                    onClick={handleUnsubscribe}
                                    className="px-4 py-2 bg-gray-500 text-white rounded"
                                >
                                    Unsubscribe ({subscriberCount})
                                </button>
                                :
                                <button
                                    onClick={handleSubscribe}
                                    className="px-4 py-2 bg-green-600 text-white rounded"
                                >
                                    Subscribe ({subscriberCount})
                                </button>
                        }
                    </div>
                </div>
            </div>
            <CommentSection videoId={video._id} />
        </>
    );
};

export default VideoPlayer;
