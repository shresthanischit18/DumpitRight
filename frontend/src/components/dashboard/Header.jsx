// import { UserIcon } from '@heroicons/react/24/solid';

import { Chip } from "@material-tailwind/react";
import { getCookie } from "../../utils";
// import {
//   apiRequestHandler,
//   getUserIDFromLocalStorage,
//   getUserInfoFromLocalStorage,
// } from '../../utils';
// import { useEffect, useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
import { Typography } from "@material-tailwind/react";

export default function Header() {
  //   const fetchUserData = async () => {
  //     const userID = getUserIDFromLocalStorage();
  //     return apiRequestHandler.getRequest({
  //       endpoint: '/users/' + userID,
  //     });
  //   };

  //   const { data: userData } = useQuery({
  //     queryKey: ['Total Balance'],
  //     queryFn: fetchUserData,
  //   });

  //   useEffect(() => {
  //     if (userData?.data?.totalBalance) {
  //       setTotalBalance(userData.data.totalBalance);
  //     }
  //   }, [userData]);

  return (
    <div className="bg-white border-b border-gray-200  h-16 px-4 flex items-center  justify-between">
      <div className="flex justify-between w-full">
        <Typography variant="h4">
          Hey, {JSON.parse(getCookie("user"))?.fullName}
        </Typography>

        <Chip value={JSON.parse(getCookie("user"))?.role} color="green" />
      </div>
    </div>
  );
}
