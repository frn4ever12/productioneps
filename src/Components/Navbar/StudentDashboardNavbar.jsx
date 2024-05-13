// import React from 'react'

// const StudentDashboardNavbar = () => {
//   return (
//     <div>StudentDashboardNavbar</div>
//   )
// }

// export default StudentDashboardNavbar

import React from "react";
import { BiMenu } from "react-icons/bi";
import { GrClose } from "react-icons/gr";
import { useAuth } from "../../Hooks/UseAuth";
import photo1 from "../../Image/file.png";

function StudentDashboardNavbar({ sidebarOpen, toggleSidebar }) {
  const { logout, user } = useAuth();

  return (
    <>
      <div className="bg-white h-14 text-black grid grid-cols-2 w-full items-center">
        {/* for logo */}
        <div className=" object-cover">
          <img src={photo1} className="scale-75 w-12 h-12 ml-7" />
        </div>
        <div className="flex items-center justify-end px-2 space-x-4 md:space-x-6">
          <div className="flex items-center justify-center flex-col">
            <p className="text-[22px]">{user.user_name}</p>
            <p>Student</p>
          </div>
          {/* for login button */}
          <span
            onClick={logout}
            className="text-sm md:text-base px-3 py-1 hover:bg-red-300 bg-red-200 rounded text-red-700 cursor-pointer"
          >
            LogOut
          </span>
          <div
            className="md:hidden block text-2xl font-bold cursor-pointer"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? (
              <GrClose className="w-6 h-6 font-light" />
            ) : (
              <BiMenu className="w-6 h-6" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentDashboardNavbar;
