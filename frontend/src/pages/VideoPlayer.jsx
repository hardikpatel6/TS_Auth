import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideoByIdApi, likeVideoApi, dislikeVideoApi, subscribeVideoApi, unsubscribeVideoApi } from "../api/videoApi";

const VideoPlayer = () => {
    const { id } = useParams();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [dislikeCount, setDislikeCount] = useState(0);
    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await getVideoByIdApi(id);
                setVideo(res.data);
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
            await likeVideoApi(video._id);
            if (isLiked) {
                // remove like
                setLikeCount(prev => prev - 1);
            }else {
                // add like
                setLikeCount(prev => prev + 1);
                setIsLiked(true);

                // remove dislike if exists
                if (isDisliked) {
                    setDislikeCount(prev => prev - 1);
                    setIsDisliked(false);
                }

            }

        }
        catch (error) {

            console.error(error);

        }

    };

    const handleDislike = async () => {
        try {
            const res = await dislikeVideoApi(video._id);
            setVideo((prev) => ({ ...prev, dislikes: res.data.dislikes }));
        } catch (error) {
            console.error("Error disliking the video:", error);
        }
    };

    const handleSubscribe = async () => {
        try {
            const res = await subscribeVideoApi(video._id);
            setVideo((prev) => ({ ...prev, subscribers: res.data.subscribers }));
        } catch (error) {
            console.error("Error subscribing to the channel:", error);
        }
    };

    const handleUnsubscribe = async () => {
        try {
            const res = await unsubscribeVideoApi(video._id);
            setVideo((prev) => ({ ...prev, subscribers: res.data.subscribers }));
        } catch (error) {
            console.error("Error unsubscribing from the channel:", error);
        }
    };

    if (loading)
        return (
            <div className="text-center mt-10">
                Loading video...
            </div>
        );

    if (!video)
        return (
            <div className="text-center mt-10">
                Video not found.
            </div>
        );

    return (
        <div className="flex justify-center px-4 mt-6">
            {/* Main container */}
            <div className="w-full max-w-4xl">
                {/* Video */}
                <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
                    <video controls className="w-full h-full">
                        <source src={video.url} type="video/mp4" />
                    </video>
                </div>
                {/* Video info */}
                <h1 className="text-xl font-semibold mt-4">{video.title}</h1>
                <p className="text-gray-600 mt-2">{video.description}</p>
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
                    <button onClick={handleSubscribe} className="px-4 py-2 bg-green-500 text-white rounded">
                        Subscribe ({video.subscribers})
                    </button>
                    <button onClick={handleUnsubscribe} className="px-4 py-2 bg-gray-500 text-white rounded">
                        Unsubscribe
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;