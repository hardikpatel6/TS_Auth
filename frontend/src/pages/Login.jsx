import { useState } from "react";
import { loginApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate , Link} from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { setUser, setToken } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginApi(form);
      localStorage.setItem("accessToken", res.data.accessToken);
      setUser(res.data.user);
      setToken(res.data.accessToken);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <button>Login</button>
      {/* 🔹 Signup redirect */}
      <p style={{ marginTop: "10px" }}>
        Don’t have an account?{" "}
        <Link to="/signup" style={{ color: "blue" }}>
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default Login;
