import React, { useEffect } from "react";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const UserAuth = ({ children }) => {
  const { user } = useUser();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
    }
  }, [token, user, navigate]);

  if (!token || !user) {
    return <div>loading...</div>;
  }

  return <>{children}</>;
};

export default UserAuth;
