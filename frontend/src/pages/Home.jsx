// src/pages/Home.jsx
import { useAuth } from "../context/AuthContext";
import VideoGrid from "../component/VideoGrid";
const Home = () => {
  const { user } = useAuth();

  return (
    <>
      <div>
        <h1>Welcome {user?.name}</h1>
        <p>This page is accessible only after login.</p>
      </div>
      <div>

        <h2>Recommended</h2>

        <VideoGrid />

      </div>
    </>

  );
};

export default Home;
