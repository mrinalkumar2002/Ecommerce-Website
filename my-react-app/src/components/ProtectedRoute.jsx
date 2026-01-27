import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    api
      .get("/auth/me") // backend checks cookie
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
    return <p>Checking authentication...</p>;
  }

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
