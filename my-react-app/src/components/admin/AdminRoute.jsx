import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../../api";

const loaderStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "18px",
  background: "#f5f7fa",
  color: "#6366f1",
  fontSize: "15px",
  fontWeight: "700",
  fontFamily: "'Inter', 'Outfit', system-ui, sans-serif",
};

const spinnerStyle = {
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  border: "3px solid #e2e8f0",
  borderTopColor: "#6366f1",
  animation: "admin-route-spin 0.8s linear infinite",
};

export default function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    api
      .get("/auth/admin/me")
      .then((res) => {
        if (res.data?.user?.role === "admin") {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      })
      .catch(() => {
        setAuthorized(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <>
        <style>{`@keyframes admin-route-spin { to { transform: rotate(360deg); } }`}</style>
        <div style={loaderStyle}>
          <div style={spinnerStyle} />
          <span>Verifying admin access...</span>
        </div>
      </>
    );
  }

  if (!authorized) {
    return <Navigate to="/login" state={{ adminTab: true }} replace />;
  }

  return children;
}
