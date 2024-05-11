// import React from "react";

// const StudentPrivateRoute = () => {
//   return <div>StudentPrivateRoute</div>;
// };

// export default StudentPrivateRoute;
import React from "react";
import { Outlet } from "react-router-dom";

import { useState } from "react";
import StudentDashboardNavbar from "../Components/Navbar/StudentDashboardNavbar";
import StudentSidebar from "../Components/Sidebar/StudentSidebar";
// import { ToastContainer } from "react-toastify";

function StudentPrivateRoute() {
  const [sideOpen, setSideOpen] = useState(true);

  const toggleSide = () => {
    setSideOpen(!sideOpen);
  };

  return (
    <>
      <div className=" h-screen max-h-screen overflow-auto flex flex-col font-montserrat">
        <div className="flex w-full">
          <StudentDashboardNavbar
            sidebarOpen={sideOpen}
            toggleSidebar={toggleSide}
          />
        </div>
        <div className="flex flex-1 bg-gray-200">
          <StudentSidebar open={sideOpen} toggleSidebar={toggleSide} />
          <div className="w-full h-screen overflow-auto flex flex-col px-6 py-2 bg-gray-200">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentPrivateRoute;
