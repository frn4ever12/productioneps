import React from "react";
import { Outlet } from "react-router-dom";

import { useState } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import AdminDashboardNavbar from "../Components/Navbar/AdminDashboardNavbar";
// import { ToastContainer } from "react-toastify";

function AdminPrivateRoute() {
  const [sideOpen, setSideOpen] = useState(true);

  const toggleSide = () => {
    setSideOpen(!sideOpen);
  };

  return (
    <>
      <div className=" h-screen  flex flex-col font-montserrat">
        <div className="flex w-full">
          <AdminDashboardNavbar
            sidebarOpen={sideOpen}
            toggleSidebar={toggleSide}
          />
        </div>
        <div className="flex flex-1 bg-gray-200">
          <Sidebar open={sideOpen} toggleSidebar={toggleSide} />
          <div className="w-full h-screen overflow-auto flex flex-col px-6 py-2 bg-gray-200">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPrivateRoute;
