import React from "react";
import SingleCard from "./Components/SingleCard";
import FreeExam from "./Components/FreeExam";

const StudentExam = () => {
  return (
    <div>
      <div className="w-full flex flex-col">
        <p className="w-full text-[45px] ml-6 m-5 font-[600]">Free Exams</p>
        <div>
          <FreeExam />
        </div>
      </div>
    </div>
  );
};

export default StudentExam;
