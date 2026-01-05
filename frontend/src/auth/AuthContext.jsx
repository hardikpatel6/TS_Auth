// // src/auth/AuthContext.jsx
// import { createContext, useContext, useEffect, useState } from "react";
// import { getProfileApi,refreshTokenApi } from "../api/authApi";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const initAuth = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await getProfileApi();
//         setUser(res.data.user);
//       } catch (err) {
//         localStorage.removeItem("token");
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initAuth();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getProfileApi, refreshTokenApi } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1️⃣ Try getting profile with existing access token
        const profileRes = await getProfileApi();
        setUser(profileRes.data.user);
      } catch (err) {
        try {
          // 2️⃣ Access token expired → refresh it
          const refreshRes = await refreshTokenApi();

          const newAccessToken = refreshRes.data.accessToken;
          localStorage.setItem("token", newAccessToken);

          // 3️⃣ Retry profile request
          const profileRes = await getProfileApi();
          setUser(profileRes.data.user);
        } catch (refreshErr) {
          // 4️⃣ Refresh token invalid → full logout
          localStorage.removeItem("token");
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
