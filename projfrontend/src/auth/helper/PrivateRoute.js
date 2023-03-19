import React from "react";
import { Route, redirect, Navigate } from "react-router-dom";
import { isAuthenticated } from "./index";

const PrivateRoute = ({ children, ...rest }) => {
  return <div>{isAuthenticated() ? children : <Navigate to="/signin" />}</div>;
};

export default PrivateRoute;
