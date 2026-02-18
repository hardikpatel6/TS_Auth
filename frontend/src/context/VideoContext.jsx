import { createContext, useContext, useState, useEffect } from "react";
import { getVideosApi } from "../api/videoApi";

const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await getVideosApi();
        setVideos(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <VideoContext.Provider value={{ videos, loading }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideos = () => useContext(VideoContext);
