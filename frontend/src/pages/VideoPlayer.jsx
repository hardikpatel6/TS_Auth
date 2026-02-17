import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideoByIdApi } from "../api/videoApi";

const VideoPlayer = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Loading video...</p>;

  if (!video) return <p>Video not found.</p>;

  return (
    <div>
      <h1>{video.title}</h1>
      <video controls width="100%">
        <source src={video.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p>{video.description}</p>
    </div>
  );
};

export default VideoPlayer;