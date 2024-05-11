import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Hooks/UseAuth";

const StudetProtected = () => {
  const { user } = useAuth();
  console.log(user);

  if (user && user.student) {
    return <Outlet />;
  } else {
    return <Navigate to="/" replace={true} />;
  }
};

export default StudetProtected;
