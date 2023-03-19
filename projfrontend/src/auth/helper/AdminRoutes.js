import React from "react";
import { Route, redirect, Navigate } from "react-router-dom";
import { isAuthenticated } from "./index";
const AdminRoutes = ({ children, ...rest }) => {
  return (
    <div>
      {isAuthenticated() && isAuthenticated().user.role === 1 ? (
        children
      ) : (
        <Navigate to="/signin" />
      )}
    </div>
  );
};

export default AdminRoutes;
