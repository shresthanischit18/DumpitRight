import React, { useEffect } from "react";
import { getUserInfoFromCookie } from "../../utils";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectRoutes = () => {
  const userInfo = getUserInfoFromCookie();

  useEffect(() => {
    if (!userInfo) {
      toast.warn("You need to login to access this page");
    }
  }, [userInfo]);

  return userInfo ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectRoutes;
