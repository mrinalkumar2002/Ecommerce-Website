import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api";

const loaderStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "18px",
  background: "#05070a",
  color: "#60a5fa",
  fontSize: "15px",
  fontWeight: "800",
  fontFamily: "'Outfit', system-ui, sans-serif",
  letterSpacing: "0.5px",
};

const spinnerStyle = {
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  border: "3px solid rgba(0, 112, 243, 0.2)",
  borderTopColor: "#0070f3",
  borderRightColor: "#3b82f6",
  animation: "protected-spin 0.8s linear infinite",
  boxShadow: "0 0 20px rgba(0, 112, 243, 0.35)",
};

const spinKeyframes = `
@keyframes protected-spin {
  to { transform: rotate(360deg); }
}
`;

export default function ProtectedRoute({ children }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    api
      .get("/auth/me")
      .then(() => {
        setAuthorized(true);
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
        <style>{spinKeyframes}</style>
        <div style={loaderStyle}>
          <div style={spinnerStyle} />
          <span>{t("common.pleaseWait") || "Please wait..."}</span>
        </div>
      </>
    );
  }

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
