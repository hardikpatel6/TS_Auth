import { useVideos } from "../context/VideoContext";
import VideoCard from "./VideoCard";

const VideoGrid = () => {
  const { videos, loading } = useVideos();
  if (loading)
    return <p>Loading videos...</p>;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px"
      }}
    >
      {videos.map(video => (
        <VideoCard
          key={video._id}
          video={video}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
