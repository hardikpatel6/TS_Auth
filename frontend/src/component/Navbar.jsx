// src/components/Navbar.jsx
import { logoutApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutApi();
    localStorage.removeItem("accessToken");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav>
      {user && <button onClick={handleLogout}>Logout</button>}
    </nav>
  );
};

export default Navbar;
