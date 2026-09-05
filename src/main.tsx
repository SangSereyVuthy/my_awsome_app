import React from "react";
import ReactDOM from "react-dom/client";
import { LoginForm } from "./features/auth/components/LoginForm";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", backgroundColor: "#f7fafc" }}>
      <LoginForm />
    </main>
  </React.StrictMode>
);