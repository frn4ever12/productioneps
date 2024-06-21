import React, { useState, useEffect } from "react";
// import Logo from "../assets/Edulogoo.png";
import { CgProfile } from "react-icons/cg";
import { FcAdvertising } from "react-icons/fc";
import { BsPencilSquare } from "react-icons/bs";
import { AiOutlineRightCircle, AiOutlineLeftCircle } from "react-icons/ai"; // Add AiOutlineLeftCircle for close icon
import { FaSortDown, FaSortUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiMenu } from "react-icons/bi";

const LinkMenuItem = ({ menu, index, open }) => {
  return (
    <Link
      to={menu?.link}
      key={index}
      className={`flex mx-4 items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md`}
    >
      <div className="relative group">
        {React.createElement(menu?.icon, { size: "20" })}
      </div>
      <h2
        style={{
          transitionDelay: `${index + 3}00ms`,
        }}
        className={`whitespace-pre duration-500 ${
          !open && "opacity-0 translate-x-28 overflow-hidden"
        }`}
      >
        {menu?.name}
      </h2>
    </Link>
  );
};

const ToggleMenuItem = ({ menu, index, open }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const toggleSubmenu = () => {
    setSubmenuOpen((prevVal) => !prevVal);
  };

  useEffect(() => {
    !open && setSubmenuOpen(false);
  }, [open]);

  return (
    <>
      <div
        onClick={toggleSubmenu}
        key={index}
        className={`flex mx-4 hover:cursor-pointer items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md`}
      >
        <div className="relative group">
          {React.createElement(menu?.icon, { size: "20" })}
        </div>
        <h2
          style={{
            transitionDelay: `${index + 3}00ms`,
          }}
          className={`whitespace-pre duration-500 ${
            !open && "opacity-0 translate-x-28 overflow-hidden"
          }`}
        >
          {menu?.name}
        </h2>
        <span
          style={{
            transitionDelay: `${index + 3}00ms`,
          }}
          className={`inline-flex justify-end w-full items-center duration-500 ${
            !open && "opacity-0 translate-x-28 overflow-hidden"
          }`}
        >
          {submenuOpen ? <FaSortUp /> : <FaSortDown />}
        </span>
      </div>
      {submenuOpen && open ? (
        <div className="ml-5 border-l-2">
          {menu.submenus.map((submenuItem, subindex) => (
            <LinkMenuItem
              key={index + subindex}
              menu={submenuItem}
              index={index + subindex}
              open={open}
            />
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

const StudentSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state based on window size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidemenus = [
    {
      name: "Exam List",
      link: "/studentexamlist",
      icon: BsPencilSquare,
      margin: true,
      has_submenus: false,
    },
    {
      name: "Result",
      link: "/studentresult",
      icon: FcAdvertising,
    },
    {
      name: "Profile",
      link: "/studentprofile",
      icon: CgProfile,
      has_submenus: false,
    },
  ];

  return (
    <div className="relative">
      <div
        className={`bg-gray-700 h-screen md:h-full ${
          isSidebarOpen
            ? "w-64 z-10 absolute top-0 left-0 md:relative md:z-0"
            : "fixed top-0 left-0 md:w-16 md:relative w-0"
        } duration-500 text-gray-100`}
      >
        {isSidebarOpen ? (
          <h2 className="font-semibold text-white text-2xl p-3 ml-5 overflow-x-hidden">
            Student
          </h2>
        ) : (
          <h2 className="font-semibold text-sm text-center text-white p-3 ml-0 overflow-x-hidden">
            Stu
          </h2>
        )}
        <div className="h-14 overflow-x-hidden md:hidden">
          <div className="w-32 h-full object-cover">
            {/* <img src={Logo} className="scale-75" /> */}
          </div>
        </div>
        <span
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-2.5 top-2.5 bg-gray-700 rounded-full cursor-pointer md:block"
        >
          {isSidebarOpen ? (
            <AiOutlineLeftCircle className="w-6 h-6" />
          ) : (
            <AiOutlineRightCircle className="w-6 h-6" />
          )}
        </span>
        <div className="mt-4 md:mt-10 flex flex-col gap-4 relative overflow-x-hidden">
          {sidemenus.map((menuitem, index) =>
            menuitem.has_submenus ? (
              <ToggleMenuItem
                key={index}
                menu={menuitem}
                index={index}
                open={isSidebarOpen}
              />
            ) : (
              <LinkMenuItem
                key={index}
                menu={menuitem}
                index={index}
                open={isSidebarOpen}
              />
            )
          )}
        </div>
      </div>
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="absolute left-0 top-2 p-3 bg-gray-700 rounded- md:hidden"
        >
          <BiMenu className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
};

export default StudentSidebar;
