// import { useNavigate } from "react-router-dom";

const VideoCard = ({ video }) => {

//   const navigate = useNavigate();

  return (

    <div
    //   onClick={() =>
    //     navigate(`/watch/${video._id}`)
    //   }
      style={{
        cursor: "pointer",
        width: "300px"
      }}
    >

      <img
        src={video.thumbnail}
        width="300"
      />

      <h4>{video.title}</h4>

      <p>{video.channelName}</p>

      <p>{video.views} views</p>

    </div>

  );

};

export default VideoCard;
