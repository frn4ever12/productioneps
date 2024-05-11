import React from "react";
import { NavLink } from "react-router-dom";

import LoginButton from "../Buttons/LoginButton";
import AppDownload from "../Buttons/AppDownload";

const Navbar = () => {
  return (
    <>
      <div className="w-full h-[20vh] flex  justify-center items-center gap-[9%] ">
        <div className="flex">
          <h1 className="text-[60px]">EPS QUESTION</h1>
        </div>
        <div className=" flex gap-[3rem] ">
          <NavLink to="/">home</NavLink>
          <NavLink to="/aboutus">HDR Krean notice</NavLink>
          <NavLink to="/">EPS nepali notice</NavLink>
        </div>
        <div className="flex gap-[2rem] items-center justify-center ">
          <div className="flex">
            <NavLink to="/login">
              <LoginButton />
            </NavLink>
          </div>
          <div className="flex">
            <button>
              <AppDownload />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
