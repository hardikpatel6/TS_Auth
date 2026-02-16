import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { VideoProvider } from "./context/VideoContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <VideoProvider>
      <App />
    </VideoProvider>
  </AuthProvider>
);
