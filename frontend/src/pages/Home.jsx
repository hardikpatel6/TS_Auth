// src/pages/Home.jsx
import { useAuth } from "../auth/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <p>This page is accessible only after login.</p>
    </div>
  );
};

export default Home;
