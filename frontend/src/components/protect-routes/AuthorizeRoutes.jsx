import React, { useEffect } from "react";
import { getUserInfoFromCookie } from "../../utils";
import { toast } from "react-toastify";
import { Navigate, Outlet } from "react-router-dom";

const AuthorizeRoutes = ({ role }) => {
  const userInfo = getUserInfoFromCookie();
  const loggedInUserRole = userInfo.role;

  useEffect(() => {
    if (!userInfo) {
      toast.warn("You need to login to access this page");
    }
  }, [userInfo]);

  return role === loggedInUserRole ? <Outlet /> : <Navigate to="/" />;
};

export default AuthorizeRoutes;
